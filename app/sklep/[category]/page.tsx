import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Define the category data type
type CategoryData = {
  title: string
  description: string
  products: Array<{
    id: string
    name: string
    salePrice: string
    originalPrice: string
    image: string
    tag?: string
  }>
}

// Map of category slugs to their display data
const categoryData: Record<string, CategoryData> = {
  koszulki: {
    title: "Koszulki",
    description: "Nasza kolekcja wysokiej jakości koszulek",
    products: Array(8)
      .fill(null)
      .map((_, i) => ({
        id: `koszulki-${i + 1}`,
        name: `Koszulka ${i % 2 === 0 ? "Cream" : "Light Gray"} Cotton`,
        salePrice: "95,20 zł",
        originalPrice: "119,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  "bluzy-z-kapturem": {
    title: "Bluzy z kapturem",
    description: "Komfortowe bluzy z kapturem na każdą okazję",
    products: Array(6)
      .fill(null)
      .map((_, i) => ({
        id: `bluzy-z-kapturem-${i + 1}`,
        name: `Bluza z kapturem ${i % 2 === 0 ? "Black" : "Gray"} Cotton`,
        salePrice: "159,20 zł",
        originalPrice: "199,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
  "bluzy-bez-kaptura": {
    title: "Bluzy bez kaptura",
    description: "Stylowe bluzy bez kaptura do codziennych stylizacji",
    products: Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `bluzy-bez-kaptura-${i + 1}`,
        name: `Bluza bez kaptura ${i % 2 === 0 ? "Navy" : "White"} Cotton`,
        salePrice: "139,20 zł",
        originalPrice: "174,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  longsleeve: {
    title: "Longsleeve",
    description: "Koszulki z długim rękawem na chłodniejsze dni",
    products: Array(7)
      .fill(null)
      .map((_, i) => ({
        id: `longsleeve-${i + 1}`,
        name: `Longsleeve ${i % 2 === 0 ? "Black" : "White"} Cotton`,
        salePrice: "119,20 zł",
        originalPrice: "149,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
  koszule: {
    title: "Koszule",
    description: "Eleganckie koszule na specjalne okazje",
    products: Array(4)
      .fill(null)
      .map((_, i) => ({
        id: `koszule-${i + 1}`,
        name: `Koszula ${i % 2 === 0 ? "White" : "Blue"} Cotton`,
        salePrice: "179,20 zł",
        originalPrice: "224,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 2 === 0 ? "SALE" : undefined,
      })),
  },
  spodnie: {
    title: "Spodnie",
    description: "Wygodne spodnie na każdą okazję",
    products: Array(6)
      .fill(null)
      .map((_, i) => ({
        id: `spodnie-${i + 1}`,
        name: `Spodnie ${i % 2 === 0 ? "Black" : "Beige"} Cotton`,
        salePrice: "199,20 zł",
        originalPrice: "249,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  szorty: {
    title: "Szorty",
    description: "Komfortowe szorty na ciepłe dni",
    products: Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `szorty-${i + 1}`,
        name: `Szorty ${i % 2 === 0 ? "Black" : "Gray"} Cotton`,
        salePrice: "129,20 zł",
        originalPrice: "159,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
  kurtki: {
    title: "Kurtki",
    description: "Stylowe kurtki na chłodniejsze dni",
    products: Array(4)
      .fill(null)
      .map((_, i) => ({
        id: `kurtki-${i + 1}`,
        name: `Kurtka ${i % 2 === 0 ? "Black" : "Olive"} Cotton`,
        salePrice: "299,20 zł",
        originalPrice: "374,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 2 === 0 ? "SALE" : undefined,
      })),
  },
  akcesoria: {
    title: "Akcesoria",
    description: "Dodatki uzupełniające Twój styl",
    products: Array(8)
      .fill(null)
      .map((_, i) => ({
        id: `akcesoria-${i + 1}`,
        name: `${i % 4 === 0 ? "Czapka" : i % 4 === 1 ? "Pasek" : i % 4 === 2 ? "Torba" : "Portfel"} ${
          i % 2 === 0 ? "Black" : "Brown"
        }`,
        salePrice: "79,20 zł",
        originalPrice: "99,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params
  const data = categoryData[category] || {
    title: "Kategoria",
    description: "Produkty z tej kategorii",
    products: [],
  }

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
            {data.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    salePrice={product.salePrice}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    tag={product.tag}
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
          </div>
        </div>
      </main>
    </>
  )
}
