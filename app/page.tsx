import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { getFeaturedProducts } from "@/actions/product-actions"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import HomeClient from "@/components/home-client"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Navbar />
      <CartDrawer />
      <section
        className="relative h-[1164px] bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/hero-sofa.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative container mx-auto h-full flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Fils de L'esthétique</h2>
            <p className="text-lg text-white mb-8">
              Rooted in design, refined through sewing craft, faultless in form.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="lg">
                Shop Now
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

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

      <HomeClient />
    </>
  )
}
