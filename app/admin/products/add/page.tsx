import { AdminProductForm } from "@/components/admin/admin-product-form"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"

export default function AddProductPage() {
  return (
    <AdminAuthCheck>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <AdminProductForm />
      </div>
    </AdminAuthCheck>
  )
}
