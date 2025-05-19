import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { getSupabase } from "@/lib/supabase"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pobierz sesję użytkownika
  const supabase = getSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Jeśli nie ma sesji, przekieruj do strony logowania
  if (!session || !session.user) {
    redirect("/login?redirect=/admin")
  }

  // Sprawdź uprawnienia administratora w bazie danych
  const { data: userData, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

  // Jeśli wystąpił błąd lub użytkownik nie ma uprawnień administratora
  if (error || !userData || !userData.is_admin) {
    // Sprawdź, czy to hubciolandos@gmail.com - specjalny przypadek
    if (session.user.email === "hubciolandos@gmail.com") {
      // Automatycznie nadaj uprawnienia administratora
      await supabase.from("users").upsert(
        {
          id: session.user.id,
          email: session.user.email,
          is_admin: true,
        },
        { onConflict: "id" },
      )
    } else {
      // Przekieruj do strony głównej
      redirect("/")
    }
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
}
