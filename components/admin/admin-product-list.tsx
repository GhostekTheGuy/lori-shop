"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { mockProducts } from "@/lib/products"

export function AdminProductList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)

  // In a real app, you would fetch this data from your API and handle filtering/sorting on the server
  let filteredProducts = [...mockProducts]

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) => product.name.toLowerCase().includes(query) || product.id.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter) {
    filteredProducts = filteredProducts.filter((product) => product.stockStatus === statusFilter)
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price-asc":
        filteredProducts.sort(
          (a, b) =>
            Number.parseFloat(a.salePrice.replace(/[^\d.-]/g, "")) -
            Number.parseFloat(b.salePrice.replace(/[^\d.-]/g, "")),
        )
        break
      case "price-desc":
        filteredProducts.sort(
          (a, b) =>
            Number.parseFloat(b.salePrice.replace(/[^\d.-]/g, "")) -
            Number.parseFloat(a.salePrice.replace(/[^\d.-]/g, "")),
        )
        break
      default:
        break
    }
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
      case "sold-out":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Sold Out</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-9 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-stock")}>In Stock</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("low-stock")}>Low Stock</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("sold-out")}>Sold Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name-asc")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")}>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price (Low to High)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price (High to Low)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-4 font-medium text-gray-500 text-sm">Product</th>
              <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
              <th className="p-4 font-medium text-gray-500 text-sm">Price</th>
              <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
              <th className="p-4 font-medium text-gray-500 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{product.id}</td>
                <td className="p-4">
                  <div className="font-medium">{product.salePrice}</div>
                  {product.salePrice !== product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">{product.originalPrice}</div>
                  )}
                </td>
                <td className="p-4">{getStatusBadge(product.stockStatus || "in-stock")}</td>
                <td className="p-4">
                  <div className="flex space-x-1">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {mockProducts.length} products
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
