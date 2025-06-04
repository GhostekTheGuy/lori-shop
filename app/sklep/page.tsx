import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/actions/product-actions"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import { Footer } from "@/components/footer"

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sklep</h1>
          <p className="text-gray-600">Wszystkie produkty</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="border-b pb-4 mb-4">
              <h2 className="font-medium mb-3">Filtry</h2>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="mr-2">
                  Nowości
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  Promocje
                </Button>
                <Button variant="outline" size="sm">
                  Bestsellery
                </Button>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-3">Kategorie</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/sklep/koszulki" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Koszulki
                  </a>
                </li>
                <li>
                  <a href="/sklep/bluzy-z-kapturem" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Bluzy z kapturem
                  </a>
                </li>
                <li>
                  <a href="/sklep/bluzy-bez-kaptura" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Bluzy bez kaptura
                  </a>
                </li>
                <li>
                  <a href="/sklep/longsleeve" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Longsleeve
                  </a>
                </li>
                <li>
                  <a href="/sklep/koszule" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Koszule
                  </a>
                </li>
                <li>
                  <a href="/sklep/spodnie" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Spodnie
                  </a>
                </li>
                <li>
                  <a href="/sklep/szorty" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Szorty
                  </a>
                </li>
                <li>
                  <a href="/sklep/kurtki" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Kurtki
                  </a>
                </li>
                <li>
                  <a href="/sklep/akcesoria" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Akcesoria
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-3">Rozmiar</h3>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" size="sm" className="h-8">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Cena</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Od"
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Do"
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
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
                  <div className="col-span-full py-12 text-center">
                    <p className="text-gray-500">Brak produktów</p>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
