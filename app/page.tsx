import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { getFeaturedProducts, getFeaturedCollections } from "@/actions/collection-actions"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import HomeClient from "@/components/home-client"
import FeaturedCollection from "@/components/featured-collection"
import { Loader2 } from "lucide-react"
import HeroSlider from "@/components/hero-slider"

// Update the home page to handle the case where we can't filter by featured collections
export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const featuredCollections = await getFeaturedCollections() // This now returns published collections

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Zastąpienie statycznego hero slajderem */}
      <HeroSlider />

      <main className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured products available</p>
              </div>
            )}
          </section>
        </Suspense>
      </main>

      {/* Collections Section - Updated to handle any published collections */}
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
      >
        {featuredCollections.length > 0
          ? featuredCollections.map((collection) => (
              <FeaturedCollection
                key={collection.id}
                id={collection.id}
                name={collection.name}
                slug={collection.slug}
                heroImage={collection.hero_image || ""}
              />
            ))
          : null}
      </Suspense>

      <HomeClient />
    </>
  )
}
