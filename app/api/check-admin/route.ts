import { getSupabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = getSupabase()

    // Get user session from cookies
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.log("API: No active session found")
      return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
    }

    // Check if user is admin
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("API: Error checking admin privileges:", error)
      return NextResponse.json({ isAdmin: false, message: "Błąd podczas sprawdzania uprawnień" }, { status: 500 })
    }

    // Return admin status
    return NextResponse.json({ isAdmin: data?.is_admin === true })
  } catch (error) {
    console.error("API: Unexpected error:", error)
    return NextResponse.json({ isAdmin: false, message: "Nieoczekiwany błąd" }, { status: 500 })
  }
}
