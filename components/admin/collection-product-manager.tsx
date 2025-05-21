"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Collection } from "@/actions/collection-actions"
import type { Product } from "@/actions/product-actions"
import {
  addProductToCollection,
  removeProductFromCollection,
  updateProductDisplayOrder,
} from "@/actions/collection-actions"
import { Loader2, Plus, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [currentProducts, setCurrentProducts] = useState<Product[]>(
    allProducts.filter((product) => collectionProductIds.includes(product.id)),
  )
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    allProducts.filter((product) => !collectionProductIds.includes(product.id)),
  )

  useEffect(() => {
    if (searchTerm) {
      const filtered = allProducts
        .filter((product) => !collectionProductIds.includes(product.id))
        .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(allProducts.filter((product) => !collectionProductIds.includes(product.id)))
    }
  }, [searchTerm, allProducts, collectionProductIds])

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

  const handleAddProduct = async (productId: string) => {
    setLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      const result = await addProductToCollection(collection.id, productId)
      if (result.success) {
        // Find the product from available products
        const product = allProducts.find((p) => p.id === productId)
        if (product) {
          // Add to current products
          setCurrentProducts((prev) => [...prev, product])
          // Remove from available products
          setFilteredProducts((prev) => prev.filter((p) => p.id !== productId))
        }
        toast({
          title: "Success",
          description: "Product added to collection",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add product to collection",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    setLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      const result = await removeProductFromCollection(collection.id, productId)
      if (result.success) {
        // Find the product from current products
        const product = currentProducts.find((p) => p.id === productId)
        if (product) {
          // Remove from current products
          setCurrentProducts((prev) => prev.filter((p) => p.id !== productId))
          // Add to available products
          setFilteredProducts((prev) => [...prev, product])
        }
        toast({
          title: "Success",
          description: "Product removed from collection",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove product from collection",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }))
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
      <Card>
        <CardHeader>
          <CardTitle>Current Products in Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {currentProducts.length === 0 ? (
            <p className="text-muted-foreground">No products in this collection yet.</p>
          ) : (
            <div className="space-y-4">
              {currentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.price.toFixed(2)} zł</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={loading[product.id] || isLoading}
                  >
                    {loading[product.id] || isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Products to Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-muted-foreground">No products available to add.</p>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.price.toFixed(2)} zł</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddProduct(product.id)}
                      disabled={loading[product.id] || isLoading}
                    >
                      {loading[product.id] || isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/admin/collections")}>
          Back to Collections
        </Button>
      </div>
    </div>
  )
}
