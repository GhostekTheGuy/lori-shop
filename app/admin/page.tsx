import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { AdminRecentProducts } from "@/components/admin/admin-recent-products"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AdminDashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentProducts />
        <AdminRecentOrders />
      </div>
    </div>
  )
}
