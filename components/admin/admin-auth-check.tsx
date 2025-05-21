"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import { getSupabase } from "@/lib/supabase"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        if (!isLoading) {
          router.replace("/login?redirect=/admin")
        }
        return
      }

      try {
        // Hardcoded admin check for known admin email
        if (user.email === "hubciolandos@gmail.com") {
          setIsAdmin(true)
          setIsCheckingAdmin(false)
          return
        }

        const supabase = getSupabase()
        if (!supabase) {
          console.error("Supabase client not initialized")
          setIsAdmin(false)
          setIsCheckingAdmin(false)
          return
        }

        // Check admin status in database
        const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

        if (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        } else {
          setIsAdmin(data?.is_admin === true)
        }
      } catch (error) {
        console.error("Unexpected error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkAdminStatus()
  }, [user, isLoading, router])

  if (isLoading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          <p className="text-lg text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    // If not admin and not loading, redirect to home
    router.replace("/")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          <p className="text-lg text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // If admin, render children
  return <>{children}</>
}
