"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"
import Link from "next/link"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Cream Cotton T-shirt",
    salePrice: "95,20 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    category: "koszulki",
    description: "Klasyczny t-shirt z wysokiej jakości bawełny w kolorze kremowym.",
  },
  {
    id: "2",
    name: "Light Gray Cotton T-shirt",
    salePrice: "95,20 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-2.png",
    tag: undefined,
    category: "koszulki",
    description: "Klasyczny t-shirt z wysokiej jakości bawełny w kolorze jasnoszarym.",
  },
  {
    id: "3",
    name: "Beige Cotton Hoodie",
    salePrice: "219,00 zł",
    originalPrice: "219,00 zł",
    image: "/images/beige-hoodie.webp",
    tag: "NEW",
    category: "bluzy-z-kapturem",
    description: "Wygodna bluza z kapturem w kolorze beżowym, wykonana z miękkiej bawełny.",
  },
  {
    id: "4",
    name: "Mauve Cotton Hoodie",
    salePrice: "219,00 zł",
    originalPrice: "219,00 zł",
    image: "/images/mauve-hoodie.webp",
    tag: "NEW",
    category: "bluzy-z-kapturem",
    description: "Wygodna bluza z kapturem w kolorze liliowym, wykonana z miękkiej bawełny.",
  },
  {
    id: "5",
    name: "Black Cotton Pants",
    salePrice: "159,20 zł",
    originalPrice: "199,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    category: "spodnie",
    description: "Wygodne spodnie z bawełny w kolorze czarnym.",
  },
  {
    id: "6",
    name: "Navy Blue Longsleeve",
    salePrice: "129,00 zł",
    originalPrice: "129,00 zł",
    image: "/images/product-2.png",
    tag: undefined,
    category: "longsleeve",
    description: "Longsleeve z wysokiej jakości bawełny w kolorze granatowym.",
  },
  {
    id: "7",
    name: "White Cotton Shirt",
    salePrice: "139,20 zł",
    originalPrice: "174,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    category: "koszule",
    description: "Klasyczna biała koszula z wysokiej jakości bawełny.",
  },
  {
    id: "8",
    name: "Beige Shorts",
    salePrice: "119,00 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-2.png",
    tag: undefined,
    category: "szorty",
    description: "Wygodne szorty w kolorze beżowym, idealne na lato.",
  },
]

// Categories for filtering
const categories = [
  { name: "Wszystkie", value: "all" },
  { name: "Koszulki", value: "koszulki" },
  { name: "Bluzy z kapturem", value: "bluzy-z-kapturem" },
  { name: "Longsleeve", value: "longsleeve" },
  { name: "Koszule", value: "koszule" },
  { name: "Spodnie", value: "spodnie" },
  { name: "Szorty", value: "szorty" },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Filter products based on search query and selected category
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim()

    const filtered = mockProducts.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      return matchesQuery && matchesCategory
    })

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory])

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Wyszukaj produkty</h1>

          {/* Search input */}
          <div className="relative mb-8">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Wyszukaj produkty..."
                className="pl-10 pr-10 py-3 text-lg border-gray-300 focus:border-black focus:ring-0"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {isSearchFocused && searchQuery && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg mt-1 max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <ul>
                    {filteredProducts.slice(0, 5).map((product) => (
                      <li key={product.id} className="border-b last:border-0">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex items-center p-3 hover:bg-gray-50"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category.replace("-", " ")}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {filteredProducts.length > 5 && (
                      <li className="p-2 text-center text-sm text-gray-500">
                        + {filteredProducts.length - 5} więcej wyników
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">Brak wyników dla "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "bg-black text-white" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Search results */}
          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">
              {searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}"` : "Wszystkie produkty"}
            </h2>
            <p className="text-gray-500">
              Znaleziono {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produkt"
                : filteredProducts.length > 1 && filteredProducts.length < 5
                  ? "produkty"
                  : "produktów"}
            </p>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
            <div className="text-center py-12 border border-gray-200 rounded-md">
              <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Brak wyników wyszukiwania</h3>
              <p className="text-gray-500 mb-6">Nie znaleziono produktów pasujących do podanych kryteriów.</p>
              <Button onClick={clearSearch} variant="outline">
                Wyczyść wyszukiwanie
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Logo and Newsletter Section */}
            <div className="mb-10 md:mb-0 md:w-1/3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">LORI</h2>
              </div>
              <p className="text-sm mb-6 max-w-md">
                Subskrybuj aby na bieżąco otrzymywać zapowiedzi, informacje o nowych kolekcjach i przecenach.
              </p>
              <div className="space-y-4">
                <Input type="text" placeholder="Imię" className="border-b border-gray-300 rounded-none px-3" />
                <Input type="email" placeholder="Email" className="border-b border-gray-300 rounded-none px-3" />
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Subskrybuj <SearchIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Site Map Section */}
            <div className="mb-10 md:mb-0">
              <h3 className="font-semibold text-base mb-4">Mapa strony</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/" className="text-sm hover:underline">
                    Strona Główna
                  </a>
                </li>
                <li>
                  <a href="/sklep" className="text-sm hover:underline">
                    Sklep
                  </a>
                </li>
                <li>
                  <a href="/kontakt" className="text-sm hover:underline">
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div>
              <h3 className="font-semibold text-base mb-4">Obsługa klienta</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Dostawa i płatność
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Zwroty i reklamacje
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Regulamin
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Polityka prywatności
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
