import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { getSupabase } from "@/lib/supabase"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    console.log("Admin layout - start")

    // Pobierz sesję użytkownika
    const supabase = getSupabase()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Sprawdź błędy sesji
    if (sessionError) {
      console.error("Błąd podczas pobierania sesji:", sessionError)
      return redirect("/login?error=session&redirect=/admin")
    }

    // Jeśli nie ma sesji, przekieruj do strony logowania
    if (!session || !session.user) {
      console.log("Brak sesji użytkownika, przekierowanie do logowania")
      return redirect("/login?redirect=/admin")
    }

    console.log("Zalogowany użytkownik:", session.user.email)

    // Sprawdź uprawnienia administratora w bazie danych
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single()

      console.log("Dane użytkownika:", userData, "Błąd:", userError)

      // Jeśli użytkownik nie istnieje w tabeli users
      if (userError && userError.code === "PGRST116") {
        console.log("Użytkownik nie istnieje w tabeli users, tworzenie...")

        // Utwórz użytkownika z uprawnieniami administratora
        const { error: insertError } = await supabase.from("users").insert({
          id: session.user.id,
          email: session.user.email,
          is_admin: true, // Nadaj uprawnienia administratora
        })

        if (insertError) {
          console.error("Błąd podczas tworzenia użytkownika:", insertError)
          return redirect("/admin-debug")
        }

        console.log("Utworzono użytkownika z uprawnieniami administratora")
      } else if (userError) {
        console.error("Błąd podczas sprawdzania uprawnień administratora:", userError)
        return redirect("/admin-debug")
      } else if (!userData || userData.is_admin !== true) {
        console.log("Użytkownik nie ma uprawnień administratora, aktualizacja...")

        // Aktualizuj uprawnienia użytkownika
        const { error: updateError } = await supabase.from("users").update({ is_admin: true }).eq("id", session.user.id)

        if (updateError) {
          console.error("Błąd podczas aktualizacji uprawnień:", updateError)
          return redirect("/admin-debug")
        }

        console.log("Zaktualizowano uprawnienia administratora")
      }
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas sprawdzania uprawnień:", error)
      return redirect("/admin-debug")
    }

    console.log("Renderowanie layoutu administratora")

    // Użytkownik ma uprawnienia administratora, renderuj layout
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Krytyczny błąd w AdminLayout:", error)
    return redirect("/admin-debug")
  }
}
