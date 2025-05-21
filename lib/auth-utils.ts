import { getSupabase } from "@/lib/supabase"

export async function checkAdminAccess() {
  try {
    console.log("Starting admin access check")
    const supabase = getSupabase()

    if (!supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Error getting session:", sessionError)
      return false
    }

    if (!session || !session.user) {
      console.log("No active session found")
      return false
    }

    console.log("Session found for user:", session.user.email)

    // Hardcoded admin check - this is a fallback for production
    if (session.user.email === "hubciolandos@gmail.com") {
      console.log("Admin access granted via hardcoded email check")

      // Ensure this user has the admin flag in the database
      try {
        const { data: existingUser } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()

        if (!existingUser) {
          // User doesn't exist in the users table, create them with admin privileges
          await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email,
            is_admin: true,
          })
          console.log("Created admin user record in database")
        } else if (!existingUser.is_admin) {
          // User exists but doesn't have admin privileges, update them
          await supabase.from("users").update({ is_admin: true }).eq("id", session.user.id)
          console.log("Updated user to have admin privileges")
        }
      } catch (dbError) {
        console.error("Error updating admin status in database:", dbError)
        // Still return true since we're using the hardcoded check as primary
      }

      return true
    }

    // Database check for admin privileges
    console.log("Checking database for admin privileges")
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("Error checking admin privileges in database:", error)
      return false
    }

    console.log("Admin check result from database:", data)
    return data?.is_admin === true
  } catch (error) {
    console.error("Unexpected error checking admin privileges:", error)
    return false
  }
}
