"use client"

import { ProductCard } from "@/components/product-card"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  salePrice: string
  originalPrice: string
  image: string
  tag?: string
  stockStatus?: "in-stock" | "low-stock" | "sold-out"
  stockQuantity?: number
}

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  columns?: 2 | 3 | 4
  skeletonCount?: number
}

export function ProductGrid({ products = [], isLoading = false, columns = 4, skeletonCount = 8 }: ProductGridProps) {
  const [isClient, setIsClient] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [hasAnimated, setHasAnimated] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle initial product appearance animation
  useEffect(() => {
    if (!isLoading && products.length > 0 && !hasAnimated) {
      // Clear any existing products first
      setVisibleProducts([])

      // Add products one by one with a staggered delay
      const animationDelay = 50 // ms between each product appearance

      products.forEach((product, index) => {
        setTimeout(() => {
          setVisibleProducts((prev) => [...prev, product])
        }, index * animationDelay)
      })

      setHasAnimated(true)
    }
  }, [isLoading, products, hasAnimated])

  // Reset animation state when products change
  useEffect(() => {
    if (isLoading) {
      setHasAnimated(false)
    }
  }, [isLoading])

  // Determine grid columns class based on prop
  const gridColumnsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns]

  if (!isClient) {
    // Return empty div during SSR to prevent hydration mismatch
    return <div className="min-h-[200px]"></div>
  }

  return (
    <div className={`grid ${gridColumnsClass} gap-6 relative`}>
      {isLoading ? (
        // Show skeletons when loading
        Array.from({ length: skeletonCount }).map((_, index) => <ProductCardSkeleton key={`skeleton-${index}`} />)
      ) : products.length > 0 ? (
        // Show products with staggered animation
        <>
          {/* Placeholder slots for products that haven't animated in yet */}
          {products.length > visibleProducts.length &&
            Array.from({ length: products.length - visibleProducts.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="w-full aspect-square opacity-0"></div>
            ))}

          {/* Visible products with animation */}
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              salePrice={product.salePrice}
              originalPrice={product.originalPrice}
              image={product.image}
              tag={product.tag}
              stockStatus={product.stockStatus}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </>
      ) : (
        // Show empty state when no products and not loading
        <div className="col-span-full py-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}
