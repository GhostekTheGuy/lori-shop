import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { checkAdminAccess } from "@/lib/auth-utils"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sprawdź, czy użytkownik ma uprawnienia administratora
  const isAdmin = await checkAdminAccess()

  // Jeśli nie jest administratorem, przekieruj do strony logowania administratora
  if (!isAdmin) {
    redirect("/admin-login")
  }

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
