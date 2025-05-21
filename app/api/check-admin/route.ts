import { getSupabase, getServerSupabase } from "@/lib/supabase"
import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const headersList = headers()
    const cookieStore = cookies()

    // Get the auth token from the custom header or cookies
    const authToken = headersList.get("x-supabase-auth") || cookieStore.get("sb-phenotype-store-auth-token")?.value

    // Get all cookies as a string for Supabase client
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ")

    console.log("API: Cookie header length:", cookieHeader.length)
    console.log("API: Auth token exists:", !!authToken)

    // Initialize Supabase with the cookie header
    const supabase = await getServerSupabase(cookieHeader)

    if (!supabase) {
      return NextResponse.json({ isAdmin: false, message: "Supabase client not initialized" }, { status: 500 })
    }

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("API: Session error:", sessionError)
      return NextResponse.json({ isAdmin: false, message: `Session error: ${sessionError.message}` }, { status: 401 })
    }

    if (!session || !session.user) {
      console.log("API: No active session found")

      // If we have an auth token but no session, try to get the user directly
      if (authToken) {
        console.log("API: Attempting to use service role to verify user")

        // Use service role to get user from JWT
        const adminSupabase = getSupabase(true)

        try {
          const { data: userData, error: userError } = await adminSupabase.auth.getUser(authToken)

          if (userError || !userData.user) {
            console.error("API: Error getting user from token:", userError)
            return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
          }

          // Check if user is admin
          const { data, error } = await adminSupabase
            .from("users")
            .select("is_admin")
            .eq("id", userData.user.id)
            .single()

          if (error) {
            console.error("API: Error checking admin privileges:", error)
            return NextResponse.json(
              { isAdmin: false, message: `Błąd podczas sprawdzania uprawnień: ${error.message}` },
              { status: 500 },
            )
          }

          console.log("API: Admin check result (service role):", data)
          return NextResponse.json({ isAdmin: data?.is_admin === true })
        } catch (err) {
          console.error("API: Error verifying token:", err)
          return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
        }
      }

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
