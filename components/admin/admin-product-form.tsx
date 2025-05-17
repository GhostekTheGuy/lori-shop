"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Loader2, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProduct, updateProduct } from "@/actions/product-actions"
import { uploadProductImage } from "@/lib/file-upload"

interface ProductFormProps {
  product?: any // In a real app, you would define a proper type
}

export function AdminProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!product
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadBucket, setUploadBucket] = useState<string | null>(null)
  const [skipImageUpload, setSkipImageUpload] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    id: product?.id || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    salePrice: product?.sale_price?.toString() || "",
    sku: product?.sku || "",
    category: product?.category || "",
    stockStatus: product?.stock_status || "in-stock",
    stockQuantity: product?.stock_quantity?.toString() || "",
    images: product?.images || [],
    tags: product?.tags || [],
    featured: product?.featured || false,
    published: product?.published || true,
    sizes: product?.sizes || [],
    colors: product?.colors || [],
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle size checkbox changes
  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? [...prev.sizes, size] : prev.sizes.filter((s) => s !== size),
    }))
  }

  // Handle color checkbox changes
  const handleColorChange = (color: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      colors: checked ? [...prev.colors, color] : prev.colors.filter((c) => c !== color),
    }))
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    if (skipImageUpload) {
      setError("Image upload is currently disabled. Please enable it to upload images.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const newImages = [...formData.images]

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        // Upload the file
        const result = await uploadProductImage(file)

        if (!result.success) {
          throw new Error(result.error || "Failed to upload image")
        }

        newImages.push(result.url)

        // Store which bucket was used for the upload
        if (result.bucket) {
          setUploadBucket(result.bucket)
        }
      }

      setFormData((prev) => ({ ...prev, images: newImages }))
    } catch (err: any) {
      console.error("Error uploading images:", err)
      setError(err.message || "Failed to upload images. Please try again.")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  // Add tag
  const [newTag, setNewTag] = useState("")
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  // Remove tag
  const removeTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare the data for submission
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : null,
        stockQuantity: formData.stockQuantity ? Number.parseInt(formData.stockQuantity) : null,
      }

      // Create or update the product
      const result = isEditing ? await updateProduct(productData) : await createProduct(productData)

      if (!result.success) {
        throw new Error(result.error || "Failed to save product")
      }

      setSuccess(`Product successfully ${isEditing ? "updated" : "created"}!`)

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/admin/products")
      }, 1500)
    } catch (err: any) {
      console.error("Error saving product:", err)
      setError(err.message || "Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle skip image upload
  const toggleSkipImageUpload = () => {
    setSkipImageUpload(!skipImageUpload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Regular Price (zł)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (zł)</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="koszulki">Koszulki</SelectItem>
                    <SelectItem value="bluzy-z-kapturem">Bluzy z kapturem</SelectItem>
                    <SelectItem value="bluzy-bez-kaptura">Bluzy bez kaptura</SelectItem>
                    <SelectItem value="longsleeve">Longsleeve</SelectItem>
                    <SelectItem value="koszule">Koszule</SelectItem>
                    <SelectItem value="spodnie">Spodnie</SelectItem>
                    <SelectItem value="szorty">Szorty</SelectItem>
                    <SelectItem value="kurtki">Kurtki</SelectItem>
                    <SelectItem value="akcesoria">Akcesoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter product SKU"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="rounded-r-none"
                />
                <Button type="button" onClick={addTag} className="rounded-l-none bg-black hover:bg-gray-800">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <div className="space-y-4">
            <Label>Product Images</Label>

            <Alert className="bg-green-50 border-green-200 mb-4">
              <Info className="h-4 w-4 text-green-600 mr-2" />
              <AlertDescription className="text-green-800">
                <p className="font-medium">Przesyłanie zdjęć zostało zaktualizowane</p>
                <p className="mt-1">
                  Teraz używamy klucza serwisowego do przesyłania zdjęć, co pozwala ominąć ograniczenia polityk RLS.
                  Spróbuj przesłać zdjęcie ponownie.
                </p>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X size={16} className="text-gray-700" />
                  </button>
                </div>
              ))}
              <label
                className={`aspect-square bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center ${skipImageUpload ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"} transition-colors`}
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isUploading || skipImageUpload}
                />
              </label>
            </div>

            {formData.images.length === 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <AlertDescription className="text-blue-800">
                  Możesz kontynuować bez zdjęć i dodać je później.
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-gray-500">
              Możesz przesłać do 8 zdjęć. Pierwsze zdjęcie będzie używane jako miniatura produktu.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stockStatus">Stock Status</Label>
              <Select value={formData.stockStatus} onValueChange={(value) => handleSelectChange("stockStatus", value)}>
                <SelectTrigger id="stockStatus">
                  <SelectValue placeholder="Select stock status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.stockStatus === "low-stock" && (
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Product
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">Featured products are displayed prominently on the homepage.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleCheckboxChange("published", checked as boolean)}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">Published products are visible to customers.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sizes">Available Sizes</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                    />
                    <Label htmlFor={`size-${size}`} className="cursor-pointer">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Available Colors</Label>
              <div className="flex flex-wrap gap-3">
                {["Black", "White", "Gray", "Red", "Blue", "Green"].map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={formData.colors.includes(color)}
                      onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                    />
                    <Label htmlFor={`color-${color}`} className="cursor-pointer">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}
