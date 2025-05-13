"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"
import { createOrder } from "@/actions/order-actions"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    phone: "",
  })

  // Load Stripe
  useEffect(() => {
    const loadStripe = async () => {
      const stripe = await getStripe()
      setStripePromise(stripe)
    }
    loadStripe()
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/sklep")
    }
  }, [items, authLoading, router])

  // Handle checkout
  const handleCheckout = async (formData: typeof shippingAddress) => {
    if (!user) {
      router.push("/login?redirect=checkout")
      return
    }

    setIsProcessing(true)
    setShippingAddress(formData)

    try {
      const result = await createOrder({
        userId: user.id,
        items,
        shippingAddress: formData,
        total: subtotal,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      setClientSecret(result.clientSecret || null)
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = () => {
    clearCart()
    router.push("/checkout/success")
  }

  if (authLoading || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Payment</h2>
                  <p className="text-gray-600 mb-6">Complete your purchase by providing your payment details.</p>
                  <CheckoutForm onSuccess={handlePaymentSuccess} />
                </div>
              </Elements>
            ) : (
              <CheckoutForm isAddressForm onSubmitAddress={handleCheckout} isProcessing={isProcessing} />
            )}
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary items={items} subtotal={subtotal} />
          </div>
        </div>
      </main>
    </>
  )
}
