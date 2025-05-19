import { OrderDetailClient } from "@/components/account/order-detail-client"

export const metadata = {
  title: "Szczegóły zamówienia | LORI",
  description: "Szczegóły zamówienia w sklepie LORI",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailClient orderId={params.id} />
}
