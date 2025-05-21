import type React from "react"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/lib/auth-utils"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if the user has admin access
  const isAdmin = await checkAdminAccess()

  // If not an admin, redirect to the home page
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
