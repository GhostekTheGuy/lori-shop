"use client"

import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col w-full relative", className)}>
      {/* Image skeleton */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col mt-3 px-1 space-y-2">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto skeleton-shimmer" />

        {/* Price skeleton */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-16 skeleton-shimmer" />
          <div className="h-3 bg-gray-200 rounded w-14 skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
