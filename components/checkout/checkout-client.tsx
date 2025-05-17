"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createOrder } from "@/actions/order-actions"
import { AddressForm } from "@/components/checkout/address-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Loader2, CreditCard, Truck } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Initialize Stripe on the client side only
let stripePromise: Promise<any> | null = null

const getStripe = () => {
  if (!stripePromise && typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      stripePromise = loadStripe(key)
    }
  }
  return stripePromise
}

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash_on_delivery">("stripe")
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    phone: "",
  })
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address")
  const [orderId, setOrderId] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0 && !orderId) {
      router.push("/koszyk")
    }
  }, [items, authLoading, router, orderId])

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
        paymentMethod: paymentMethod,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      setOrderId(result.orderId || null)

      if (paymentMethod === "stripe") {
        if (result.clientSecret) {
          setClientSecret(result.clientSecret)
          setCurrentStep("payment")
        } else {
          throw new Error("No client secret returned for Stripe payment")
        }
      } else {
        // For cash on delivery, go directly to success page
        handlePaymentSuccess()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment method change
  const handlePaymentMethodChange = (method: "stripe" | "cash_on_delivery") => {
    setPaymentMethod(method)
  }

  // Handle successful payment
  const handlePaymentSuccess = () => {
    clearCart()
    router.push("/checkout/success")
  }

  // Handle cash on delivery
  const handleCashOnDelivery = async () => {
    setIsProcessing(true)

    try {
      // We already created the order, just redirect to success
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing
      handlePaymentSuccess()
    } catch (error) {
      console.error("Error processing cash on delivery:", error)
      alert("Wystąpił błąd. Spróbuj ponownie.")
      setIsProcessing(false)
    }
  }

  if (authLoading || (items.length === 0 && !orderId)) {
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
        <h1 className="text-3xl font-bold mb-8">Zamówienie</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "address" ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dane dostawy</h2>
                <p className="text-gray-600 mb-6">Wprowadź dane potrzebne do realizacji zamówienia.</p>

                <Tabs defaultValue={paymentMethod} onValueChange={(value) => handlePaymentMethodChange(value as any)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="stripe" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Karta płatnicza
                    </TabsTrigger>
                    <TabsTrigger value="cash_on_delivery" className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Płatność przy odbiorze
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <AddressForm onSubmitAddress={handleCheckout} isProcessing={isProcessing} />
              </div>
            ) : clientSecret && getStripe() ? (
              <Elements stripe={getStripe()} options={{ clientSecret }}>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Płatność</h2>
                  <p className="text-gray-600 mb-6">Dokończ zamówienie, podając dane karty płatniczej.</p>
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </div>
              </Elements>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Płatność przy odbiorze</h2>
                <p className="text-gray-600 mb-6">
                  Wybrałeś płatność przy odbiorze. Zapłacisz kurierowi przy dostawie zamówienia.
                </p>
                <Button
                  onClick={handleCashOnDelivery}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Przetwarzanie...
                    </>
                  ) : (
                    "Potwierdź zamówienie"
                  )}
                </Button>
              </div>
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
