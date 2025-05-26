"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Elements } from "@stripe/react-stripe-js"
import { createOrder } from "@/actions/order-actions"
import { AddressForm } from "@/components/checkout/address-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getStripePublic } from "@/lib/stripe"

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
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
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(false)

  // Detect if we're in a preview environment
  useEffect(() => {
    // Check if we're in a preview environment (iframe or restricted environment)
    const isPreview =
      typeof window !== "undefined" &&
      (window.self !== window.top || // In iframe
        window.location.hostname.includes("vercel.app")) // Vercel preview

    setIsPreviewEnvironment(isPreview)
  }, [])

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
        paymentMethod: "stripe",
        isPreviewEnvironment: isPreviewEnvironment,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      setOrderId(result.orderId || null)

      if (result.clientSecret) {
        setClientSecret(result.clientSecret)
        setCurrentStep("payment")
      } else {
        throw new Error("No client secret returned for Stripe payment")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = () => {
    clearCart()
    router.push("/checkout/success")
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

        {isPreviewEnvironment && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Wykryto środowisko podglądu. Niektóre funkcje płatności mogą być ograniczone.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "address" ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Dane dostawy</h2>
                <p className="text-gray-600 mb-6">Wprowadź dane potrzebne do realizacji zamówienia.</p>

                <AddressForm onSubmitAddress={handleCheckout} isProcessing={isProcessing} />
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={getStripePublic()}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#000000",
                    },
                  },
                  locale: "pl",
                }}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Płatność</h2>
                  <p className="text-gray-600 mb-6">Dokończ zamówienie, wybierając metodę płatności.</p>
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </div>
              </Elements>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary items={items} subtotal={subtotal} />
          </div>
        </div>
      </main>
    </>
  )
}
