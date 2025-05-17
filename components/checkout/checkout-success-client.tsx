"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, FileText } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Clear the cart on successful checkout
    clearCart()

    // Get the payment intent ID from the URL
    const paymentIntentId = searchParams.get("payment_intent")
    const orderIdParam = searchParams.get("order_id")

    // Use the order ID from the URL or generate a mock one
    setOrderId(orderIdParam || "ORD-" + Math.floor(Math.random() * 10000))
  }, [clearCart, searchParams])

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Dziękujemy za złożenie zamówienia!</h1>
          <p className="text-lg text-gray-600 mb-8">Twoje zamówienie zostało przyjęte i jest przetwarzane.</p>

          {orderId && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 mb-2">Numer zamówienia:</p>
              <p className="text-xl font-semibold">{orderId}</p>
              <p className="text-sm text-gray-500 mt-2">Potwierdzenie zostało wysłane na Twój adres email.</p>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">Co dalej?</h3>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Otrzymasz email z potwierdzeniem zamówienia.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Przygotujemy Twoje zamówienie do wysyłki.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Wyślemy Ci powiadomienie, gdy zamówienie zostanie wysłane.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Możesz śledzić status zamówienia w sekcji "Moje zamówienia".</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Moje zamówienia
              </Button>
            </Link>
            <Link href="/sklep">
              <Button className="w-full sm:w-auto bg-black hover:bg-gray-800 flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Kontynuuj zakupy
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
