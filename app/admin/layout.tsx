import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

// Add this to prevent static generation of admin pages
export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
