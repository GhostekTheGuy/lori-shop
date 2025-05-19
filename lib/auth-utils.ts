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

    // Sprawdź, czy użytkownik jest administratorem
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
