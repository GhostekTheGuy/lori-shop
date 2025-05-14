import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import Link from "next/link"
import Image from "next/image"
import { getCollectionWithProducts } from "@/actions/collection-actions"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"

export default async function CollectionPage({ params }: { params: { collection: string } }) {
  const { collection: slug } = params
  const collectionData = await getCollectionWithProducts(slug)

  if (!collectionData) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] bg-gray-100">
        <Image
          src={
            collectionData.hero_image || "/placeholder.svg?height=800&width=1200&query=abstract collection background"
          }
          alt={collectionData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{collectionData.name}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">{collectionData.description}</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/sklep" className="hover:text-black hover:underline">
              Sklep
            </Link>
            <span className="mx-2">/</span>
            <Link href="/kolekcje" className="hover:text-black hover:underline">
              Kolekcje
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{collectionData.name}</span>
          </div>
        </div>

        {/* Products grid */}
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {collectionData.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collectionData.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    salePrice={
                      product.sale_price ? `${product.sale_price.toFixed(2)} zł` : `${product.price.toFixed(2)} zł`
                    }
                    originalPrice={
                      product.sale_price ? `${product.price.toFixed(2)} zł` : `${product.price.toFixed(2)} zł`
                    }
                    image={product.images[0] || "/placeholder.svg"}
                    tag={product.sale_price ? "SALE" : undefined}
                    stockStatus={product.stock_status}
                    stockQuantity={product.stock_quantity}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Brak produktów w tej kolekcji.</p>
                <Link href="/sklep" className="text-black underline">
                  Wróć do sklepu
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </main>
    </>
  )
}
