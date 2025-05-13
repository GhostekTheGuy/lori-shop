"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
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

    // In a real app, you would fetch the order details using the payment intent ID
    // For now, we'll just use a mock order ID
    setOrderId("ORD-" + Math.floor(Math.random() * 10000))
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

          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-gray-600 mb-8">Your order has been successfully placed and is being processed.</p>

          {orderId && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 mb-2">Order Reference:</p>
              <p className="text-xl font-semibold">{orderId}</p>
              <p className="text-sm text-gray-500 mt-2">A confirmation email has been sent to your email address.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                View My Orders
              </Button>
            </Link>
            <Link href="/sklep">
              <Button className="w-full sm:w-auto bg-black hover:bg-gray-800">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
