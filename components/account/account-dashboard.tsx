"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserOrderStats } from "@/actions/order-actions"
import { formatCurrency } from "@/lib/utils"
import { Loader2, ShoppingBag, CreditCard, Calendar } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

interface AccountDashboardProps {
  userId: string
}

export function AccountDashboard({ userId }: AccountDashboardProps) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await getUserOrderStats(userId)
        setStats(data)
      } catch (err) {
        console.error("Error fetching user stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">Nie udało się załadować statystyk konta</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <ShoppingBag className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Liczba zamówień</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Suma wydatków</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ostatnie zamówienie</p>
                <p className="text-2xl font-bold">
                  {stats.recentOrders && stats.recentOrders.length > 0
                    ? format(new Date(stats.recentOrders[0].created_at), "d MMM yyyy", { locale: pl })
                    : "Brak"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie zamówienia</CardTitle>
          <CardDescription>Twoje ostatnie zamówienia</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Zamówienie #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.created_at), "d MMMM yyyy", { locale: pl })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        Szczegóły
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">Nie masz jeszcze żadnych zamówień</div>
          )}

          <div className="mt-4 text-center">
            <Link href="/account?tab=orders">
              <Button variant="outline">Zobacz wszystkie zamówienia</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
