import { AdminProductForm } from "@/components/admin/admin-product-form"
import { getProductById } from "@/lib/products"

export default function EditProduct({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the product data from your database
  const product = getProductById(params.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <AdminProductForm product={product} />
    </div>
  )
}
