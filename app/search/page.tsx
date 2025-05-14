import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import SearchClient from "@/components/search-client"
import { searchProducts } from "@/actions/product-actions"

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const query = searchParams?.q || ""
  const products = query ? await searchProducts(query) : []

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 pt-24 pb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Wyszukaj produkty</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <SearchClient initialQuery={query} initialProducts={products} />
      </Suspense>
    </>
  )
}
