import { AdminProductList } from "@/components/admin/admin-product-list"

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      <AdminProductList />
    </div>
  )
}
