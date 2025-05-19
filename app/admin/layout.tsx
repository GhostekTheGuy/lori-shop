import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { getSupabase } from "@/lib/supabase"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // Pobierz sesję użytkownika
    const supabase = getSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Jeśli nie ma sesji, przekieruj do strony logowania
    if (!session || !session.user) {
      console.log("Brak sesji użytkownika, przekierowanie do logowania")
      return redirect("/login?redirect=/admin")
    }

    console.log("Zalogowany użytkownik:", session.user.email)

    // Sprawdź, czy to hubciolandos@gmail.com - specjalny przypadek
    if (session.user.email === "hubciolandos@gmail.com") {
      console.log("Użytkownik hubciolandos@gmail.com - automatyczny dostęp")

      try {
        // Automatycznie nadaj uprawnienia administratora
        await supabase.from("users").upsert(
          {
            id: session.user.id,
            email: session.user.email,
            is_admin: true,
          },
          { onConflict: "id" },
        )
      } catch (error) {
        console.error("Błąd podczas nadawania uprawnień administratora:", error)
        // Kontynuuj mimo błędu - hubciolandos@gmail.com zawsze ma dostęp
      }

      // Renderuj layout administratora dla hubciolandos@gmail.com
      return (
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      )
    }

    // Dla innych użytkowników sprawdź uprawnienia administratora w bazie danych
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single()

      if (error) {
        console.error("Błąd podczas sprawdzania uprawnień administratora:", error)
        return redirect("/")
      }

      if (!userData || !userData.is_admin) {
        console.log("Użytkownik nie ma uprawnień administratora")
        return redirect("/")
      }

      console.log("Użytkownik ma uprawnienia administratora")
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas sprawdzania uprawnień:", error)
      return redirect("/")
    }

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
    return redirect("/")
  }
}
