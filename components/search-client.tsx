"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"
import { searchProducts, type Product } from "@/actions/product-actions"

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

interface SearchClientProps {
  initialQuery: string
  initialProducts: Product[]
}

export default function SearchClient({ initialQuery, initialProducts }: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  // Update search query when URL changes
  useEffect(() => {
    const query = searchParams.get("q") || ""
    setSearchQuery(query)
  }, [searchParams])

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)

      try {
        const results = await searchProducts(searchQuery.trim())
        setProducts(results)
        setFilteredProducts(
          selectedCategory === "all" ? results : results.filter((p) => p.category === selectedCategory),
        )
      } catch (error) {
        console.error("Error searching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    router.push("/search")
    setProducts([])
    setFilteredProducts([])
  }

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wyszukaj produkty</h1>

        {/* Search input */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj produkty..."
              className="pl-10 pr-10 py-3 text-lg border-gray-300 focus:border-black focus:ring-0"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                salePrice={
                  product.sale_price ? `${product.sale_price.toFixed(2)} zł` : `${product.price.toFixed(2)} zł`
                }
                originalPrice={product.sale_price ? `${product.price.toFixed(2)} zł` : `${product.price.toFixed(2)} zł`}
                image={product.images[0] || "/placeholder.svg"}
                tag={product.sale_price ? "SALE" : undefined}
                stockStatus={product.stock_status}
                stockQuantity={product.stock_quantity}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12 border border-gray-200 rounded-md">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Brak wyników wyszukiwania</h3>
            <p className="text-gray-500 mb-6">Nie znaleziono produktów pasujących do podanych kryteriów.</p>
            <Button onClick={clearSearch} variant="outline">
              Wyczyść wyszukiwanie
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Rozpocznij wyszukiwanie</h3>
            <p className="text-gray-500">Wpisz frazę, aby znaleźć produkty</p>
          </div>
        )}
      </div>
    </main>
  )
}
