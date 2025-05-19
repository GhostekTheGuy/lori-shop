"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Users, Package, Tag, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

// Uproszczona lista podstron - tylko te, które są w pełni zintegrowane z bazą danych
const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Collections", href: "/admin/collections", icon: Layers },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Customers", href: "/admin/customers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
          >
            <span className="mr-3 h-5 w-5 flex items-center justify-center">←</span>
            Back to Store
          </Link>
        </div>
      </div>
    </aside>
  )
}
