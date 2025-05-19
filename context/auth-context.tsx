"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getSupabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)

  useEffect(() => {
    // Check if Supabase is available
    const supabase = getSupabase()
    if (!supabase) {
      console.error("Supabase client not initialized")
      setIsLoading(false)
      return
    }

    setSupabaseInitialized(true)

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          // Jeśli wystąpił błąd z tokenem odświeżania, wyczyść sesję
          if (error.message?.includes("refresh_token_not_found")) {
            await supabase.auth.signOut()
            setSession(null)
            setUser(null)
            setIsAdmin(false)
          }
          setIsLoading(false)
          return
        }

        setSession(data.session)
        setUser(data.session?.user ?? null)

        if (data.session?.user?.id) {
          await checkIfAdmin(data.session.user)
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event)

      try {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user?.id) {
          await checkIfAdmin(newSession.user)
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error("Error in auth state change handler:", err)
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Check if user is an admin
  const checkIfAdmin = async (user: User | null) => {
    if (!user || !user.id) {
      setIsAdmin(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setIsAdmin(false)
      return
    }

    try {
      // Sprawdź uprawnienia administratora w bazie danych
      const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

      if (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data?.is_admin === true)
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (!error && data?.user) {
        // Sprawdź, czy użytkownik istnieje w tabeli users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        // Jeśli użytkownik nie istnieje w tabeli users, dodaj go
        if (userError && userError.code === "PGRST116") {
          await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email,
            is_admin: false,
          })
        }
      }

      return { error }
    } catch (err: any) {
      console.error("Error during sign in:", err)
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: { message: "Supabase client not initialized" }, data: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      // If signup is successful, create a user record in the users table
      if (!error && data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          is_admin: false, // Domyślnie użytkownik nie jest administratorem
        })
      }

      return { data, error }
    } catch (err: any) {
      console.error("Error during sign up:", err)
      return { error: err, data: null }
    }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    if (supabase) {
      try {
        await supabase.auth.signOut()
        // Wyczyść stan po wylogowaniu
        setUser(null)
        setSession(null)
        setIsAdmin(false)
      } catch (err) {
        console.error("Error during sign out:", err)
      }
    }
  }

  const resetPassword = async (email: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (err: any) {
      console.error("Error during password reset:", err)
      return { error: err }
    }
  }

  // If Supabase is not initialized, provide a minimal context
  if (!supabaseInitialized) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          session: null,
          isLoading: false,
          isAdmin: false,
          signIn: async () => ({ error: { message: "Supabase client not initialized" } }),
          signUp: async () => ({ error: { message: "Supabase client not initialized" }, data: null }),
          signOut: async () => {},
          resetPassword: async () => ({ error: { message: "Supabase client not initialized" } }),
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
