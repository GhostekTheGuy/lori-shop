import { Suspense } from "react"
import { OrderDetailClient } from "@/components/account/order-detail-client"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Szczegóły zamówienia | LORI",
  description: "Szczegóły zamówienia w sklepie LORI",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <OrderDetailClient orderId={params.id} />
    </Suspense>
  )
}
