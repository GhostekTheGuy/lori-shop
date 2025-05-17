import { Suspense } from "react"
import CheckoutClient from "@/components/checkout/checkout-client"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Checkout - Phenotype Store",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
