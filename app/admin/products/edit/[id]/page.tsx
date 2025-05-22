import { getProductById } from "@/actions/product-actions"
import { AdminProductForm } from "@/components/admin/admin-product-form"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return (
      <AdminAuthCheck>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6">Product Not Found</h1>
          <p>The product you are trying to edit does not exist.</p>
        </div>
      </AdminAuthCheck>
    )
  }

  return (
    <AdminAuthCheck>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <AdminProductForm product={product} />
      </div>
    </AdminAuthCheck>
  )
}
