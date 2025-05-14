import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getProductsByCategory } from "@/actions/product-actions"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import { Suspense } from "react"

// Define the category data type
type CategoryData = {
  title: string
  description: string
}

// Map of category slugs to their display data
const categoryData: Record<string, CategoryData> = {
  koszulki: {
    title: "Koszulki",
    description: "Nasza kolekcja wysokiej jakości koszulek",
  },
  "bluzy-z-kapturem": {
    title: "Bluzy z kapturem",
    description: "Komfortowe bluzy z kapturem na każdą okazję",
  },
  "bluzy-bez-kaptura": {
    title: "Bluzy bez kaptura",
    description: "Stylowe bluzy bez kaptura do codziennych stylizacji",
  },
  longsleeve: {
    title: "Longsleeve",
    description: "Koszulki z długim rękawem na chłodniejsze dni",
  },
  koszule: {
    title: "Koszule",
    description: "Eleganckie koszule na specjalne okazje",
  },
  spodnie: {
    title: "Spodnie",
    description: "Wygodne spodnie na każdą okazję",
  },
  szorty: {
    title: "Szorty",
    description: "Komfortowe szorty na ciepłe dni",
  },
  kurtki: {
    title: "Kurtki",
    description: "Stylowe kurtki na chłodniejsze dni",
  },
  akcesoria: {
    title: "Akcesoria",
    description: "Dodatki uzupełniające Twój styl",
  },
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
  const data = categoryData[category] || {
    title: "Kategoria",
    description: "Produkty z tej kategorii",
  }

  const products = await getProductsByCategory(category)

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-2">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/sklep" className="hover:text-black hover:underline">
              Sklep
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{data.title}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
          <p className="text-gray-600">{data.description}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
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
                {Object.entries(categoryData).map(([slug, { title }]) => (
                  <li key={slug}>
                    <Link
                      href={`/sklep/${slug}`}
                      className={`text-sm hover:underline ${
                        category === slug ? "text-black font-medium" : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
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
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
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
                  <p className="text-gray-500 mb-4">Brak produktów w tej kategorii.</p>
                  <Link href="/sklep" className="text-black underline">
                    Wróć do sklepu
                  </Link>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}
