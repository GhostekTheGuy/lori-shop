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

    console.log("API: Checking admin status for user:", session.user.id)

    // Check if user is admin
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("API: Error checking admin privileges:", error)

      // If the error is that the user doesn't exist in the users table, create them
      if (error.code === "PGRST116") {
        console.log("API: User not found in users table, creating entry")

        // Insert the user into the users table
        const { error: insertError } = await supabase.from("users").insert({
          id: session.user.id,
          email: session.user.email,
          is_admin: false, // Default to non-admin
        })

        if (insertError) {
          console.error("API: Error creating user entry:", insertError)
          return NextResponse.json(
            {
              isAdmin: false,
              message: "Błąd podczas tworzenia użytkownika",
            },
            { status: 500 },
          )
        }

        return NextResponse.json({ isAdmin: false })
      }

      return NextResponse.json(
        {
          isAdmin: false,
          message: `Błąd podczas sprawdzania uprawnień: ${error.message}`,
        },
        { status: 500 },
      )
    }

    console.log("API: Admin check result:", data)

    // Return admin status
    return NextResponse.json({ isAdmin: data?.is_admin === true })
  } catch (error: any) {
    console.error("API: Unexpected error:", error)
    return NextResponse.json(
      {
        isAdmin: false,
        message: `Nieoczekiwany błąd: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
