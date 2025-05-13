"use client"

import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockProducts } from "@/lib/products"

export function AdminRecentProducts() {
  // In a real app, you would fetch this data from your API
  const recentProducts = mockProducts.slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium">Recent Products</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {recentProducts.map((product) => (
          <div key={product.id} className="p-4 flex items-center">
            <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {product.stockStatus === "low-stock"
                  ? "Low Stock"
                  : product.stockStatus === "sold-out"
                    ? "Sold Out"
                    : "In Stock"}
              </p>
            </div>
            <div className="text-sm font-medium">{product.salePrice}</div>
            <div className="ml-4 flex space-x-1">
              <Link href={`/admin/products/edit/${product.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link href="/admin/products" className="text-sm font-medium text-black hover:underline">
          View all products
        </Link>
      </div>
    </div>
  )
}
