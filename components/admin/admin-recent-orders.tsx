"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getRecentOrders } from "@/actions/order-actions"
import { formatCurrency } from "@/lib/utils"

interface Order {
  id: string
  created_at: string
  total: number
  status: string
  payment_status: string
  users?: {
    email: string
    first_name?: string
    last_name?: string
  }
}

export function AdminRecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true)
        const data = await getRecentOrders()
        setOrders(data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching recent orders:", err)
        setError("Nie udało się pobrać ostatnich zamówień")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pl-PL")
  }

  // Function to get customer name
  const getCustomerName = (order: Order) => {
    if (order.users) {
      if (order.users.first_name && order.users.last_name) {
        return `${order.users.first_name} ${order.users.last_name}`
      }
      return order.users.email
    }
    return "Nieznany klient"
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 flex items-center">
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="ml-4 h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="ml-4 h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="p-6 text-center text-red-500">{error}</div>
      </div>
    )
  }

  // Render empty state
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="p-6 text-center text-gray-500">Brak zamówień</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium">Recent Orders</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.id} className="p-4 flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{order.id}</p>
              <p className="text-xs text-gray-500 mt-1">{getCustomerName(order)}</p>
            </div>
            <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
            <div className="ml-4 text-sm font-medium">{formatCurrency(order.total)}</div>
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
