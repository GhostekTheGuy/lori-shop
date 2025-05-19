import { getSupabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = getSupabase()

    // Pobierz sesję użytkownika z ciasteczek
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
    }

    // Sprawdź, czy użytkownik jest administratorem
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error) {
      console.error("Błąd podczas sprawdzania uprawnień administratora:", error)
      return NextResponse.json({ isAdmin: false, message: "Błąd podczas sprawdzania uprawnień" }, { status: 500 })
    }

    return NextResponse.json({ isAdmin: data?.is_admin || false })
  } catch (error) {
    console.error("Nieoczekiwany błąd:", error)
    return NextResponse.json({ isAdmin: false, message: "Nieoczekiwany błąd" }, { status: 500 })
  }
}
