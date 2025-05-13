"use client"

import { CreditCard, Package, ShoppingCart, Users } from "lucide-react"

const stats = [
  {
    name: "Total Revenue",
    value: "12,345 zł",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
  },
  {
    name: "Orders",
    value: "356",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    value: "124",
    change: "+4.6%",
    trend: "up",
    icon: Package,
  },
  {
    name: "Customers",
    value: "2,567",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
]

export function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <stat.icon className="h-6 w-6 text-gray-700" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}
