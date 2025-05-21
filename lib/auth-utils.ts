import { getSupabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function checkAdminAccess() {
  try {
    const cookieStore = cookies()
    const supabase = getSupabase()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.log("No active session found")
      return false
    }

    console.log("Checking admin access for user:", session.user.id)

    // Check admin privileges in database
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("Error checking admin privileges:", error)

      // If the user doesn't exist in the users table, create them
      if (error.code === "PGRST116") {
        console.log("User not found in users table, creating entry")

        // Insert the user into the users table
        const { error: insertError } = await supabase.from("users").insert({
          id: session.user.id,
          email: session.user.email,
          is_admin: false, // Default to non-admin
        })

        if (insertError) {
          console.error("Error creating user entry:", insertError)
          return false
        }

        return false
      }

      return false
    }

    console.log("Admin check result:", data)

    // Return true only if is_admin is explicitly true
    return data?.is_admin === true
  } catch (error) {
    console.error("Unexpected error checking admin privileges:", error)
    return false
  }
}
