import { AdminAuthCheck } from "@/components/admin/admin-auth-check"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRecentProducts } from "@/components/admin/admin-recent-products"

export default function AdminDashboardPage() {
  return (
    <AdminAuthCheck>
      <div className="space-y-6">
        <AdminHeader heading="Dashboard" text="Overview of your store performance" />
        <AdminDashboardStats />
        <div className="grid gap-6 md:grid-cols-2">
          <AdminRecentProducts />
          <AdminRecentOrders />
        </div>
      </div>
    </AdminAuthCheck>
  )
}
