"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getAllProductsForAdmin, deleteProduct, type Product } from "@/actions/product-actions"
import { useRouter } from "next/navigation"

export function AdminProductList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const data = await getAllProductsForAdmin()
      setProducts(data)
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // Apply search filter
  let filteredProducts = [...products]
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) => product.name.toLowerCase().includes(query) || product.id.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter) {
    filteredProducts = filteredProducts.filter((product) => product.stock_status === statusFilter)
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
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
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

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id)
      if (result.success) {
        // Remove the product from the local state
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      } else {
        alert(`Failed to delete product: ${result.error}`)
      }
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
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
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
                    <div className="font-medium">{product.price.toFixed(2)} zł</div>
                    {product.sale_price && (
                      <div className="text-xs text-gray-500 line-through">{product.sale_price.toFixed(2)} zł</div>
                    )}
                  </td>
                  <td className="p-4">{getStatusBadge(product.stock_status)}</td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <p className="text-gray-500">No products found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
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
