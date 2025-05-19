import { Suspense } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOrderList } from "@/components/admin/admin-order-list"
import { getOrders } from "@/actions/order-actions"

export const metadata = {
  title: "Orders Management | Admin Panel",
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <AdminHeader title="Orders Management" description="View and manage all customer orders" />

      <Suspense fallback={<div className="text-center py-10">Loading orders...</div>}>
        <AdminOrderList initialOrders={orders} />
      </Suspense>
    </div>
  )
}
