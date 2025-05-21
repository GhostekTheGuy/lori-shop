import type React from "react"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/lib/auth-utils"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getSupabase } from "@/lib/supabase"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // Get the Supabase client
    const supabase = getSupabase()
    if (!supabase) {
      console.error("Supabase client not initialized in admin layout")
      redirect("/")
    }

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Error getting session in admin layout:", sessionError)
      redirect("/login?redirect=/admin")
    }

    if (!session || !session.user) {
      console.log("No active session found in admin layout")
      redirect("/login?redirect=/admin")
    }

    // Hardcoded admin check for production
    if (session.user.email === "hubciolandos@gmail.com") {
      // Allow access directly for the known admin email
      return (
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 p-8">{children}</div>
        </div>
      )
    }

    // Check if the user has admin access
    const isAdmin = await checkAdminAccess()

    // If not an admin, redirect to the home page
    if (!isAdmin) {
      console.log("User is not an admin, redirecting")
      redirect("/")
    }

    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">{children}</div>
      </div>
    )
  } catch (error) {
    console.error("Unexpected error in admin layout:", error)
    redirect("/")
  }
}
