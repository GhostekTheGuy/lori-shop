import { Suspense } from "react"
import { getProductById } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import ProductDetail from "@/components/product-detail"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Loader2 } from "lucide-react"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 pt-24 pb-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <ProductDetail product={product} />
      </Suspense>
    </>
  )
}
