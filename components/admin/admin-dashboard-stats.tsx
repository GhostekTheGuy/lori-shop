"use client"

import { useEffect, useState } from "react"
import { CreditCard, Package, ShoppingCart, Users } from "lucide-react"
import { getDashboardStats } from "@/actions/stats-actions"
import type { DashboardStats } from "@/actions/stats-actions"

// Default stats to use when data can't be fetched
const defaultStats: DashboardStats = {
  revenue: {
    current: 12345,
    previous: 10980,
    percentChange: 12.5,
  },
  orders: {
    current: 356,
    previous: 329,
    percentChange: 8.2,
  },
  products: {
    current: 124,
    previous: 118,
    percentChange: 4.6,
  },
  customers: {
    current: 2567,
    previous: 2225,
    percentChange: 15.3,
  },
}

export function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      if (useMockData) {
        setStats(defaultStats)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getDashboardStats()

        // Check if we got valid data
        const hasValidData =
          data &&
          typeof data.revenue?.current === "number" &&
          typeof data.orders?.current === "number" &&
          typeof data.products?.current === "number" &&
          typeof data.customers?.current === "number"

        if (hasValidData) {
          setStats(data)
          setError(null)
        } else {
          throw new Error("Received invalid data format")
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        setError("Nie udało się pobrać statystyk. Wyświetlam dane przykładowe.")
        // Use default stats when there's an error
        setStats(defaultStats)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [useMockData])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Show warning if there was an error but we're using default stats
  const WarningBanner = () => {
    if (!error) return null

    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
        <p>{error}</p>
        <div className="mt-2">
          <button onClick={() => setUseMockData(!useMockData)} className="text-xs font-medium underline">
            {useMockData ? "Spróbuj użyć prawdziwych danych" : "Użyj danych przykładowych"}
          </button>
        </div>
      </div>
    )
  }

  const statItems = stats
    ? [
        {
          name: "Total Revenue",
          value: formatCurrency(stats.revenue.current),
          change: `${stats.revenue.percentChange > 0 ? "+" : ""}${stats.revenue.percentChange.toFixed(1)}%`,
          trend: stats.revenue.percentChange >= 0 ? "up" : "down",
          icon: CreditCard,
        },
        {
          name: "Orders",
          value: stats.orders.current.toString(),
          change: `${stats.orders.percentChange > 0 ? "+" : ""}${stats.orders.percentChange.toFixed(1)}%`,
          trend: stats.orders.percentChange >= 0 ? "up" : "down",
          icon: ShoppingCart,
        },
        {
          name: "Products",
          value: stats.products.current.toString(),
          change: `${stats.products.percentChange > 0 ? "+" : ""}${stats.products.percentChange.toFixed(1)}%`,
          trend: stats.products.percentChange >= 0 ? "up" : "down",
          icon: Package,
        },
        {
          name: "Customers",
          value: stats.customers.current.toString(),
          change: `${stats.customers.percentChange > 0 ? "+" : ""}${stats.customers.percentChange.toFixed(1)}%`,
          trend: stats.customers.percentChange >= 0 ? "up" : "down",
          icon: Users,
        },
      ]
    : []

  return (
    <>
      <WarningBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat) => (
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
    </>
  )
}
