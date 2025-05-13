import { loadStripe } from "@stripe/stripe-js"
import Stripe from "stripe"

// Load Stripe on the client side
export const getStripe = async () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  return await loadStripe(stripePublishableKey)
}

// Initialize Stripe on the server side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
})
