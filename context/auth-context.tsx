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

        // Check admin status if user is logged in
        if (data.session?.user) {
          await checkAdminStatus(data.session.user)
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

        // Check admin status if user is logged in
        if (newSession?.user) {
          await checkAdminStatus(newSession.user)
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

  // Check if user is admin
  const checkAdminStatus = async (user: User) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    // Hardcoded admin check
    if (user.email === "hubciolandos@gmail.com") {
      setIsAdmin(true)
      return
    }

    try {
      const supabase = getSupabase()
      if (!supabase) {
        setIsAdmin(false)
        return
      }

      const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

      if (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data?.is_admin === true)
    } catch (error) {
      console.error("Unexpected error checking admin status:", error)
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
          })
        }

        // Check admin status
        await checkAdminStatus(data.user)
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
          is_admin: false, // Default to non-admin
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
    if (!supabase) return

    try {
      console.log("Signing out...")

      // 1. Najpierw wyczyść stan React
      setUser(null)
      setSession(null)
      setIsAdmin(false)

      // 2. Wyczyść pamięć lokalną i ciasteczka
      if (typeof window !== "undefined") {
        // Wyczyść elementy pamięci lokalnej związane z Supabase
        const storageKey = "phenotype-store-auth"
        localStorage.removeItem(storageKey)
        localStorage.removeItem(`${storageKey}-token`)

        // Wyczyść ciasteczka sesji
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/;domain=${window.location.hostname}`)
        })
      }

      // 3. Wywołaj wylogowanie Supabase z zakresem globalnym
      await supabase.auth.signOut({ scope: "global" })

      console.log("Sign out successful")

      // 4. Użyj bezpośredniego przekierowania zamiast window.location.href
      if (typeof window !== "undefined") {
        // Dodaj parametr timestamp, aby zapobiec cachowaniu
        const timestamp = Date.now()

        // Użyj setTimeout, aby dać przeglądarce czas na przetworzenie wylogowania
        setTimeout(() => {
          // Użyj window.location.replace zamiast window.location.href
          window.location.replace(`/?logout=${timestamp}`)
        }, 100)
      }
    } catch (err) {
      console.error("Error during sign out:", err)

      // Nawet w przypadku błędu, wymuś przekierowanie
      if (typeof window !== "undefined") {
        const timestamp = Date.now()
        setTimeout(() => {
          window.location.replace(`/?logout=${timestamp}`)
        }, 100)
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
