import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null

export function getStripePublic() {
  if (!stripePromise && typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      stripePromise = loadStripe(key)
    }
  }
  return stripePromise
}

// Check if we're in a preview environment
export function isPreviewEnvironment() {
  if (typeof window === "undefined") return false

  return (
    window.self !== window.top || // In iframe
    window.location.hostname.includes("vercel.app") // Vercel preview
  )
}

// Server-side Stripe instance
let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("Missing Stripe secret key")
    }

    stripe = new Stripe(key, {
      apiVersion: "2023-10-16",
    })
  }
  return stripe
}

interface PaymentIntentParams {
  amount: number
  currency: string
  metadata?: Record<string, string>
  payment_method_types?: string[]
}

export async function createPaymentIntent(params: PaymentIntentParams) {
  const stripe = getStripe()

  // Default payment method types
  const paymentMethodTypes = params.payment_method_types || ["card", "p24"]

  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    metadata: params.metadata || {},
    payment_method_types: paymentMethodTypes,
  })

  return paymentIntent
}
