import Stripe from "stripe"

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
}

export async function createPaymentIntent(params: PaymentIntentParams) {
  try {
    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return null
  }
}
