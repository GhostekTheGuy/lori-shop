"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { getOrderById } from "@/actions/order-actions"
import { formatCurrency } from "@/lib/utils"
import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"

interface OrderDetailClientProps {
  orderId: string
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push("/login?redirect=/account/orders/" + orderId)
      return
    }

    if (user) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true)
          const orderData = await getOrderById(orderId)

          // Check if order belongs to current user
          if (orderData && orderData.user_id !== user.id) {
            setError("Nie masz dostępu do tego zamówienia")
            setOrder(null)
          } else {
            setOrder(orderData)
            setError(null)
          }
        } catch (err) {
          console.error("Error fetching order:", err)
          setError("Wystąpił błąd podczas pobierania danych zamówienia")
          setOrder(null)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrder()
    }
  }, [orderId, user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Powrót
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error || "Nie znaleziono zamówienia"}</p>
                <Button onClick={() => router.push("/account")}>Wróć do konta</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const { id, created_at, status, total, items, shipping_address, payment_status } = order

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button variant="ghost" onClick={() => router.push("/account")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do konta
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle>Zamówienie #{id}</CardTitle>
              <div className="text-sm text-gray-500 mt-2 md:mt-0">
                Data: {new Date(created_at).toLocaleDateString("pl-PL")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  status === "completed"
                    ? "bg-green-100 text-green-800"
                    : status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                Status:{" "}
                {status === "completed"
                  ? "Zrealizowane"
                  : status === "processing"
                    ? "W trakcie realizacji"
                    : status === "cancelled"
                      ? "Anulowane"
                      : "Oczekujące"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : payment_status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                Płatność:{" "}
                {payment_status === "paid"
                  ? "Opłacone"
                  : payment_status === "pending"
                    ? "Oczekująca"
                    : payment_status === "failed"
                      ? "Nieudana"
                      : payment_status === "cash_on_delivery"
                        ? "Za pobraniem"
                        : "Nieznany"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Products */}
              <div>
                <h3 className="font-medium text-lg mb-4">Produkty</h3>
                <div className="space-y-4">
                  {items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4">
                      <div className="w-16 h-16 bg-gray-100 relative flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Brak zdjęcia
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="text-sm text-gray-500">
                          {item.size && <span className="mr-2">Rozmiar: {item.size}</span>}
                          {item.color && <span>Kolor: {item.color}</span>}
                        </div>
                        <div className="text-sm">
                          {formatCurrency(item.price)} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium text-lg mb-4">Adres dostawy</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{shipping_address.name}</p>
                  <p>{shipping_address.street}</p>
                  <p>
                    {shipping_address.postal_code} {shipping_address.city}
                  </p>
                  <p>{shipping_address.country}</p>
                  {shipping_address.phone && <p>Tel: {shipping_address.phone}</p>}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-lg mb-4">Podsumowanie</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Wartość produktów:</span>
                    <span>{formatCurrency(total - (shipping_address.shipping_cost || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Koszt dostawy:</span>
                    <span>{formatCurrency(shipping_address.shipping_cost || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Razem:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/account?tab=orders")}>
            Wróć do zamówień
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Drukuj zamówienie
          </Button>
        </div>
      </div>
    </>
  )
}
