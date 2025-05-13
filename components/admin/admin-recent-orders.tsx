"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock orders data
const recentOrders = [
  {
    id: "ORD-001",
    customer: "Jan Kowalski",
    date: "2023-05-12",
    total: "219,00 zł",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Anna Nowak",
    date: "2023-05-11",
    total: "349,60 zł",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Piotr Wiśniewski",
    date: "2023-05-10",
    total: "95,20 zł",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Magdalena Kowalczyk",
    date: "2023-05-09",
    total: "438,00 zł",
    status: "shipped",
  },
  {
    id: "ORD-005",
    customer: "Tomasz Lewandowski",
    date: "2023-05-08",
    total: "129,00 zł",
    status: "cancelled",
  },
]

export function AdminRecentOrders() {
  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium">Recent Orders</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {recentOrders.map((order) => (
          <div key={order.id} className="p-4 flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{order.id}</p>
              <p className="text-xs text-gray-500 mt-1">{order.customer}</p>
            </div>
            <div className="text-sm text-gray-500">{order.date}</div>
            <div className="ml-4 text-sm font-medium">{order.total}</div>
            <div className="ml-4">{getStatusBadge(order.status)}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link href="/admin/orders" className="text-sm font-medium text-black hover:underline">
          View all orders
        </Link>
      </div>
    </div>
  )
}
