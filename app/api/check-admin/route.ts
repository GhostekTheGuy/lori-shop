import { getSupabase } from "@/lib/supabase"
import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const headersList = headers()
    const cookieStore = cookies()

    // Pobierz token autoryzacyjny z nagłówka
    const authHeader = headersList.get("authorization")
    const token = authHeader ? authHeader.replace("Bearer ", "") : null

    // Pobierz token z ciasteczka jako alternatywę
    const authCookie = cookieStore.get("sb-phenotype-store-auth-token")?.value

    // Użyj tokenu z nagłówka lub ciasteczka
    const authToken = token || authCookie

    console.log("API: Token autoryzacyjny istnieje:", !!authToken)

    if (!authToken) {
      console.log("API: Brak tokenu autoryzacyjnego")
      return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
    }

    // Użyj klienta Supabase z uprawnieniami administratora
    const supabase = getSupabase(true)

    if (!supabase) {
      return NextResponse.json({ isAdmin: false, message: "Nie można zainicjować klienta Supabase" }, { status: 500 })
    }

    // Pobierz użytkownika na podstawie tokenu
    const { data: userData, error: userError } = await supabase.auth.getUser(authToken)

    if (userError || !userData.user) {
      console.error("API: Błąd pobierania użytkownika z tokenu:", userError)
      return NextResponse.json({ isAdmin: false, message: "Nie zalogowano" }, { status: 401 })
    }

    console.log("API: Sprawdzanie statusu administratora dla użytkownika:", userData.user.id)

    // Sprawdź, czy użytkownik jest administratorem
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", userData.user.id).single()

    if (error) {
      console.error("API: Błąd sprawdzania uprawnień administratora:", error)

      // Jeśli błąd wynika z braku użytkownika w tabeli users, utwórz go
      if (error.code === "PGRST116") {
        console.log("API: Użytkownik nie znaleziony w tabeli users, tworzenie wpisu")

        // Dodaj użytkownika do tabeli users
        const { error: insertError } = await supabase.from("users").insert({
          id: userData.user.id,
          email: userData.user.email,
          is_admin: false, // Domyślnie użytkownik nie jest administratorem
        })

        if (insertError) {
          console.error("API: Błąd tworzenia wpisu użytkownika:", insertError)
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

    console.log("API: Wynik sprawdzania administratora:", data)

    // Zwróć status administratora
    return NextResponse.json({ isAdmin: data?.is_admin === true })
  } catch (error: any) {
    console.error("API: Nieoczekiwany błąd:", error)
    return NextResponse.json(
      {
        isAdmin: false,
        message: `Nieoczekiwany błąd: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
