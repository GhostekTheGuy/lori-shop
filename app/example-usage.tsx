"use client"

import { ProductGrid } from "@/components/product-grid"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

// Generate more mock products for a longer page
const generateMockProducts = (count = 24) => {
  const baseProducts = [
    {
      id: "1",
      name: "Cream Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
      stockStatus: "in-stock" as const,
    },
    {
      id: "2",
      name: "Light Gray Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      stockStatus: "low-stock" as const,
      stockQuantity: 3,
    },
    {
      id: "3",
      name: "Beige Cotton Hoodie",
      salePrice: "219,00 zł",
      originalPrice: "219,00 zł",
      image: "/images/beige-hoodie.webp",
      tag: "NEW",
      stockStatus: "in-stock" as const,
    },
    {
      id: "4",
      name: "Mauve Cotton Hoodie",
      salePrice: "219,00 zł",
      originalPrice: "219,00 zł",
      image: "/images/mauve-hoodie.webp",
      tag: "NEW",
      stockStatus: "in-stock" as const,
    },
    {
      id: "5",
      name: "Black Cotton Pants",
      salePrice: "159,20 zł",
      originalPrice: "199,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
      stockStatus: "sold-out" as const,
    },
    {
      id: "6",
      name: "Navy Blue Longsleeve",
      salePrice: "129,00 zł",
      originalPrice: "129,00 zł",
      image: "/images/product-2.png",
      stockStatus: "in-stock" as const,
    },
    {
      id: "7",
      name: "White Cotton Shirt",
      salePrice: "139,20 zł",
      originalPrice: "174,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
      stockStatus: "low-stock" as const,
      stockQuantity: 2,
    },
    {
      id: "8",
      name: "Beige Shorts",
      salePrice: "119,00 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      stockStatus: "in-stock" as const,
    },
  ]

  // Generate additional products based on the base products
  const products = []
  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length]
    products.push({
      ...baseProduct,
      id: `${i + 1}`,
      name: `${baseProduct.name} ${Math.floor(i / baseProducts.length) + 1}`,
    })
  }

  return products
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [enableScrollAnimation, setEnableScrollAnimation] = useState(true)

  // Simulate data fetching
  useEffect(() => {
    const fetchProducts = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProducts(generateMockProducts(24))
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // Function to reload products for demo purposes
  const handleReload = () => {
    setIsLoading(true)
    setProducts([])

    setTimeout(() => {
      setProducts(generateMockProducts(24))
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Our Products</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleReload} variant="outline">
            Reload Products
          </Button>
          <Button
            onClick={() => setEnableScrollAnimation(!enableScrollAnimation)}
            variant={enableScrollAnimation ? "default" : "outline"}
          >
            {enableScrollAnimation ? "Scroll Animation: ON" : "Scroll Animation: OFF"}
          </Button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-medium mb-2">Scroll Animation Demo</h2>
        <p className="text-sm text-gray-600">
          Scroll down to see products animate as they enter the viewport. Products will appear with a subtle bounce
          effect when they become visible.
        </p>
      </div>

      {/* Product grid with loading state */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        columns={4}
        skeletonCount={8}
        enableScrollAnimation={enableScrollAnimation}
      />
    </div>
  )
}
