import { loadStripe } from "@stripe/stripe-js"
import Stripe from "stripe"

// Load Stripe on the client side
export const getStripe = async () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePublishableKey) {
    console.error("Missing Stripe publishable key")
    return null
  }
  return await loadStripe(stripePublishableKey)
}

// Initialize Stripe on the server side
let stripeInstance: Stripe | null = null

export const getStripeInstance = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeInstance && stripeSecretKey) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    })
  }

  return stripeInstance
}

// For backward compatibility
export const stripe = getStripeInstance()
