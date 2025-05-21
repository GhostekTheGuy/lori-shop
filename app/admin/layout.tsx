import type React from "react"
import { checkAdminAccess } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdminAccess()

  if (!isAdmin) {
    console.log("Access denied: User is not an admin")
    redirect("/admin-login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
