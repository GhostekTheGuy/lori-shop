import { getSupabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function checkAdminAccess() {
  try {
    const cookieStore = cookies()
    const supabase = getSupabase()

    // Pobierz sesję użytkownika
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      return false
    }

    // Sprawdź, czy użytkownik ma email hubciolandos@gmail.com
    const isHubciolandos = session.user.email === "hubciolandos@gmail.com"

    // Jeśli to hubciolandos@gmail.com, automatycznie nadaj uprawnienia administratora
    if (isHubciolandos) {
      // Sprawdź, czy użytkownik już ma flagę is_admin
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single()

      // Jeśli użytkownik nie ma flagi is_admin lub ma ją ustawioną na false, zaktualizuj ją
      if (!userError && (!userData || userData.is_admin !== true)) {
        await supabase.from("users").upsert(
          {
            id: session.user.id,
            email: session.user.email,
            is_admin: true,
          },
          { onConflict: "id" },
        )
      }

      // Zawsze zwróć true dla hubciolandos@gmail.com
      return true
    }

    // Dla innych użytkowników sprawdź flagę is_admin w bazie danych
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (error || !data) {
      console.error("Błąd podczas sprawdzania uprawnień administratora:", error)
      return false
    }

    return data.is_admin === true
  } catch (error) {
    console.error("Nieoczekiwany błąd podczas sprawdzania uprawnień administratora:", error)
    return false
  }
}
