"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { LogoutButton } from "@/components/logout-button"

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isProductsOpen, setIsProductsOpen] = useState(pathname?.startsWith("/admin/products"))
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(pathname?.startsWith("/admin/collections"))

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen)
  }

  const toggleCollections = () => {
    setIsCollectionsOpen(!isCollectionsOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold text-gray-900">
          Admin Panel
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive("/admin")
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          {/* Products dropdown */}
          <div>
            <button
              onClick={toggleProducts}
              className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                pathname?.startsWith("/admin/products")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <Package className="mr-3 h-5 w-5" />
                Products
              </div>
              {isProductsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {isProductsOpen && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/admin/products"
                  className={`block px-2 py-1.5 text-sm rounded-md ${
                    isActive("/admin/products")
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  All Products
                </Link>
                <Link
                  href="/admin/products/add"
                  className={`block px-2 py-1.5 text-sm rounded-md ${
                    isActive("/admin/products/add")
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  Add Product
                </Link>
              </div>
            )}
          </div>

          {/* Collections dropdown */}
          <div>
            <button
              onClick={toggleCollections}
              className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                pathname?.startsWith("/admin/collections")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <Layers className="mr-3 h-5 w-5" />
                Collections
              </div>
              {isCollectionsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {isCollectionsOpen && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/admin/collections"
                  className={`block px-2 py-1.5 text-sm rounded-md ${
                    isActive("/admin/collections")
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  All Collections
                </Link>
                <Link
                  href="/admin/collections/add"
                  className={`block px-2 py-1.5 text-sm rounded-md ${
                    isActive("/admin/collections/add")
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  Add Collection
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admin/orders"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname?.startsWith("/admin/orders")
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            }`}
          >
            <ShoppingCart className="mr-3 h-5 w-5" />
            Orders
          </Link>

          <Link
            href="/admin/customers"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname?.startsWith("/admin/customers")
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Customers
          </Link>

          <Link
            href="/admin/categories"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname?.startsWith("/admin/categories")
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            }`}
          >
            <Tag className="mr-3 h-5 w-5" />
            Categories
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname?.startsWith("/admin/settings")
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 mt-6">
        <LogoutButton className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </LogoutButton>
      </div>
    </div>
  )
}
