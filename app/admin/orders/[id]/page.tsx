import { notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOrderDetail } from "@/components/admin/admin-order-detail"
import { getOrderById } from "@/actions/order-actions"

export const metadata = {
  title: "Order Details | Admin Panel",
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Order #${params.id.slice(0, 8)}`}
        description="View and manage order details"
        backHref="/admin/orders"
      />

      <AdminOrderDetail order={order} />
    </div>
  )
}
