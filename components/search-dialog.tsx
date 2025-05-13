"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Add keyframes animations for search elements
const searchAnimations = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

// Mock product data - same as in search page
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

// Popular search suggestions
const popularSearches = ["T-shirt", "Hoodie", "Spodnie", "Koszula", "Bluza"]

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<typeof mockProducts>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([])
      setIsSearching(false)
      return
    }

    // Simulate search delay for better UX
    setIsSearching(true)
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim()

      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )

      setFilteredProducts(filtered)
      setIsSearching(false)

      // Save to recent searches if not already there
      if (query.length >= 3 && !recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev].slice(0, 5))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, recentSearches])

  // Auto-focus the search input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    } else {
      // Clear search when dialog closes
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }, [open])

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error)
    }
  }, [])

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  const handleProductClick = () => {
    onOpenChange(false)
    setSearchQuery("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Add to recent searches
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches((prev) => [searchQuery.trim(), ...prev].slice(0, 5))
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Inject the animation styles
  useEffect(() => {
    // Create style element if it doesn't exist
    if (!document.getElementById("search-animations")) {
      const styleEl = document.createElement("style")
      styleEl.id = "search-animations"
      styleEl.innerHTML = searchAnimations
      document.head.appendChild(styleEl)

      return () => {
        // Clean up on unmount
        const styleEl = document.getElementById("search-animations")
        if (styleEl) styleEl.remove()
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 rounded-lg overflow-hidden border-0 shadow-2xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
        <div className="bg-white p-6 border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  placeholder="Czego szukasz?"
                  className="pl-12 pr-10 py-6 text-lg border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-full transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                  autoComplete="off"
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-200 rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 rounded-full h-[52px] px-6 transition-all duration-200 hover:scale-105"
              >
                <span className="mr-2">Szukaj</span>
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div
                className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                style={{ animation: "fadeInUp 0.2s ease-out" }}
              >
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 mb-2">Ostatnie wyszukiwania</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={`recent-${index}`}
                          onClick={() => handleSuggestionClick(search)}
                          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-500 mb-2">Popularne wyszukiwania</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={`popular-${index}`}
                        onClick={() => handleSuggestionClick(search)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-gray-50">
          {searchQuery ? (
            isSearching ? (
              <div
                className="p-12 flex flex-col items-center justify-center"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                <Loader2 size={40} className="text-gray-300 mb-4 animate-spin" />
                <p className="text-gray-500">Szukamy produktów...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 px-2 mb-3">
                  Znaleziono {filteredProducts.length} {filteredProducts.length === 1 ? "produkt" : "produktów"}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((product, index) => (
                    <li
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        opacity: 0,
                        animation: `fadeInUp 0.3s forwards ${index * 50}ms`,
                      }}
                    >
                      <Link
                        href={`/product/${product.id}`}
                        className="flex items-center p-3 h-full"
                        onClick={handleProductClick}
                      >
                        <div className="w-20 h-20 bg-gray-100 mr-4 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{product.category.replace(/-/g, " ")}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-600 font-medium">{product.salePrice}</span>
                            {product.originalPrice !== product.salePrice && (
                              <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-12 text-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <SearchIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Brak wyników</h3>
                <p className="text-gray-500 mb-6">Nie znaleziono produktów dla "{searchQuery}"</p>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500 mb-3">Spróbuj:</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="mr-2 text-gray-400">•</span>
                      Sprawdź pisownię
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-gray-400">•</span>
                      Użyj innych słów kluczowych
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-gray-400">•</span>
                      Użyj bardziej ogólnych terminów
                    </li>
                  </ul>
                  <Button
                    onClick={clearSearch}
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white transition-all duration-200"
                  >
                    Wyczyść wyszukiwanie
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="p-12 text-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <SearchIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Wyszukaj produkty</h3>
              <p className="text-gray-500 mb-6">Wpisz frazę, aby znaleźć produkty</p>

              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Popularne kategorie</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Koszulki", "Bluzy", "Spodnie", "Kurtki", "Akcesoria"].map((category, index) => (
                    <Link
                      key={index}
                      href={`/sklep/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => onOpenChange(false)}
                      className="bg-white border border-gray-200 hover:border-black px-4 py-2 rounded-full text-sm transition-all duration-200 hover:shadow-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Popularne wyszukiwania</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <Link
            href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "/search"}
            className="flex items-center justify-center text-sm text-black hover:underline"
            onClick={() => onOpenChange(false)}
          >
            <span>Przejdź do zaawansowanego wyszukiwania</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
