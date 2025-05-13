"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

interface ProductCardProps {
  id?: string
  image: string
  name: string
  salePrice: string
  originalPrice: string
  tag?: string
  className?: string
  stockStatus?: "in-stock" | "low-stock" | "sold-out"
  stockQuantity?: number
}

export function ProductCard({
  id = "1",
  image,
  name,
  salePrice,
  originalPrice,
  tag,
  className,
  stockStatus = "in-stock",
  stockQuantity,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)

  // Setup intersection observer to detect when card is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px", // Trigger when element is 50px into viewport
        threshold: 0.1, // Trigger when 10% of element is visible
      },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Determine stock message based on status and quantity
  const getStockMessage = () => {
    if (stockStatus === "sold-out") return "Wyprzedane"
    if (stockStatus === "low-stock") {
      if (stockQuantity !== undefined) {
        return `Tylko ${stockQuantity} szt.`
      }
      return "Ostatnie sztuki"
    }
    return null
  }

  const stockMessage = getStockMessage()

  return (
    <Link
      ref={cardRef}
      href={`/product/${id}`}
      className={cn(
        "flex flex-col w-full group relative block",
        isVisible ? "animate-productAppear" : "opacity-0 translate-y-10",
        stockStatus === "sold-out" ? "opacity-85" : "",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <div className="w-full h-full overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              stockStatus !== "sold-out" ? "group-hover:scale-110" : "",
              stockStatus === "sold-out" ? "opacity-70" : "",
            )}
          />
        </div>

        {/* Clickable overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            stockStatus !== "sold-out" ? "bg-black bg-opacity-0 group-hover:bg-opacity-10" : "",
          )}
        />

        {/* Tag (SALE, NEW, etc.) */}
        {tag && (
          <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-medium shadow-sm transition-transform duration-300 group-hover:translate-x-1">
            {tag}
          </div>
        )}

        {/* Stock status indicator */}
        {stockStatus === "sold-out" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 font-medium text-sm uppercase tracking-wider transform -rotate-12">
              Wyprzedane
            </div>
          </div>
        )}

        {/* Low stock indicator */}
        {stockStatus === "low-stock" && (
          <div className="absolute bottom-4 right-4 bg-amber-500 text-white px-3 py-1 text-xs font-medium shadow-md">
            {stockMessage}
          </div>
        )}
      </div>

      <div className="flex flex-col mt-3 px-1">
        <h3
          className={cn(
            "text-base font-medium text-center transition-colors duration-200",
            stockStatus !== "sold-out" ? "group-hover:underline" : "",
          )}
        >
          {name}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={cn("font-medium", stockStatus === "sold-out" ? "text-gray-500" : "text-red-600")}>
            {salePrice}
          </span>
          {salePrice !== originalPrice && <span className="text-gray-500 line-through text-sm">{originalPrice}</span>}
        </div>

        {/* Stock message below price for low stock (alternative position) */}
        {stockStatus === "low-stock" && stockQuantity !== undefined && stockQuantity <= 3 && (
          <p className="text-amber-600 text-xs font-medium text-center mt-1">{stockMessage}</p>
        )}
      </div>
    </Link>
  )
}
