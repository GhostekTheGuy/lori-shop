import type React from "react"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { checkAdminAccess } from "@/lib/auth-utils"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated and has admin access
  const isAdmin = await checkAdminAccess()

  // If not authenticated or not admin, redirect to admin login
  if (!isAdmin) {
    redirect("/admin-login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
