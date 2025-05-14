"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Collection } from "@/actions/collection-actions"
import type { Product } from "@/actions/product-actions"
import {
  addProductToCollection,
  removeProductFromCollection,
  updateProductDisplayOrder,
} from "@/actions/collection-actions"
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CollectionProductManagerProps {
  collection: Collection
  allProducts: Product[]
  collectionProductIds: string[]
  collectionProducts: Array<{ product_id: string; display_order: number }>
}

export function CollectionProductManager({
  collection,
  allProducts,
  collectionProductIds,
  collectionProducts,
}: CollectionProductManagerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter products that are not already in the collection
  const availableProducts = allProducts.filter((product) => !collectionProductIds.includes(product.id))

  // Filter available products by search term
  const filteredAvailableProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get products that are in the collection
  const productsInCollection = allProducts.filter((product) => collectionProductIds.includes(product.id))

  // Sort products by display order
  const sortedProductsInCollection = [...productsInCollection].sort((a, b) => {
    const aOrder = collectionProducts.find((cp) => cp.product_id === a.id)?.display_order || 0
    const bOrder = collectionProducts.find((cp) => cp.product_id === b.id)?.display_order || 0
    return aOrder - bOrder
  })

  const handleAddProduct = async () => {
    if (!selectedProductId) return

    setIsLoading(true)
    try {
      // Get the highest display order
      const highestOrder =
        collectionProducts.length > 0 ? Math.max(...collectionProducts.map((cp) => cp.display_order)) : -1

      const result = await addProductToCollection(collection.id, selectedProductId, highestOrder + 1)

      if (result.success) {
        toast({
          title: "Product added",
          description: "The product has been added to the collection.",
        })
        setSelectedProductId("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add product to collection.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    setIsLoading(true)
    try {
      const result = await removeProductFromCollection(collection.id, productId)

      if (result.success) {
        toast({
          title: "Product removed",
          description: "The product has been removed from the collection.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove product from collection.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error removing product:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoveProduct = async (productId: string, direction: "up" | "down") => {
    const currentProduct = collectionProducts.find((cp) => cp.product_id === productId)
    if (!currentProduct) return

    const currentIndex = collectionProducts.findIndex((cp) => cp.product_id === productId)

    if (direction === "up" && currentIndex > 0) {
      const prevProduct = collectionProducts[currentIndex - 1]

      // Swap display orders
      await updateProductDisplayOrder(collection.id, productId, prevProduct.display_order)
      await updateProductDisplayOrder(collection.id, prevProduct.product_id, currentProduct.display_order)

      toast({
        title: "Product moved up",
        description: "The product order has been updated.",
      })
    } else if (direction === "down" && currentIndex < collectionProducts.length - 1) {
      const nextProduct = collectionProducts[currentIndex + 1]

      // Swap display orders
      await updateProductDisplayOrder(collection.id, productId, nextProduct.display_order)
      await updateProductDisplayOrder(collection.id, nextProduct.product_id, currentProduct.display_order)

      toast({
        title: "Product moved down",
        description: "The product order has been updated.",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-lg font-medium mb-4">Add Products to Collection</h2>
        <div className="space-y-4">
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="flex space-x-4">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product to add" />
              </SelectTrigger>
              <SelectContent>
                {filteredAvailableProducts.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No products available
                  </SelectItem>
                ) : (
                  filteredAvailableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button onClick={handleAddProduct} disabled={!selectedProductId || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add to Collection
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Products in Collection</h2>
        {sortedProductsInCollection.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProductsInCollection.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.sale_price ? (
                        <div>
                          <span className="line-through text-gray-500">{product.price.toFixed(2)} zł</span>
                          <span className="ml-2 text-red-600">{product.sale_price.toFixed(2)} zł</span>
                        </div>
                      ) : (
                        <span>{product.price.toFixed(2)} zł</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveProduct(product.id, "up")}
                          disabled={index === 0 || isLoading}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveProduct(product.id, "down")}
                          disabled={index === sortedProductsInCollection.length - 1 || isLoading}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleRemoveProduct(product.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/admin/collections")}>
          Back to Collections
        </Button>
      </div>
    </div>
  )
}
