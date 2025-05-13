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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        checkIfAdmin(session.user.id)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        checkIfAdmin(session.user.id)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Check if user is an admin
  const checkIfAdmin = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setIsAdmin(false)
      return
    }

    try {
      const { data, error } = await supabase.from("users").select("is_admin").eq("id", userId).single()

      if (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data?.is_admin || false)
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

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: { message: "Supabase client not initialized" }, data: null }
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    // If signup is successful, create a user record in the users table
    if (!error && data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: email,
        is_admin: false,
      })
    }

    return { data, error }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const resetPassword = async (email: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
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
