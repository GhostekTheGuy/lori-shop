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

    // Check admin privileges in database
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("Error checking admin privileges:", error)
      return false
    }

    // Return true only if is_admin is explicitly true
    return data?.is_admin === true
  } catch (error) {
    console.error("Unexpected error checking admin privileges:", error)
    return false
  }
}
