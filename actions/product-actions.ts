"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Type for product form data
type ProductFormData = {
  id?: string
  name: string
  description: string
  price: number
  salePrice?: number | null
  category: string
  stockStatus: "in-stock" | "low-stock" | "sold-out"
  stockQuantity?: number | null
  images: string[]
  tags: string[]
  featured: boolean
  published: boolean
  sku: string
  sizes: string[]
  colors: string[]
}

// Get all products
export async function getProducts() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data
}

// Get featured products
export async function getFeaturedProducts() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data
}

// Get product by ID
export async function getProductById(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

// Get products by category
export async function getProductsByCategory(category: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }

  return data
}

// Create a new product
export async function createProduct(formData: ProductFormData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Generate a unique ID if not provided
  const productId = formData.id || uuidv4()

  const { error } = await supabase.from("products").insert({
    id: productId,
    name: formData.name,
    description: formData.description,
    price: formData.price,
    sale_price: formData.salePrice,
    category: formData.category,
    stock_status: formData.stockStatus,
    stock_quantity: formData.stockQuantity,
    images: formData.images,
    tags: formData.tags,
    featured: formData.featured,
    published: formData.published,
    sku: formData.sku,
    sizes: formData.sizes,
    colors: formData.colors,
  })

  if (error) {
    console.error("Error creating product:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page to show the new product
  revalidatePath("/admin/products")
  revalidatePath("/sklep")

  return { success: true, productId }
}

// Update an existing product
export async function updateProduct(formData: ProductFormData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  if (!formData.id) {
    return { success: false, error: "Product ID is required" }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      sale_price: formData.salePrice,
      category: formData.category,
      stock_status: formData.stockStatus,
      stock_quantity: formData.stockQuantity,
      images: formData.images,
      tags: formData.tags,
      featured: formData.featured,
      published: formData.published,
      sku: formData.sku,
      sizes: formData.sizes,
      colors: formData.colors,
    })
    .eq("id", formData.id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page to show the updated product
  revalidatePath("/admin/products")
  revalidatePath(`/product/${formData.id}`)
  revalidatePath("/sklep")

  return { success: true, productId: formData.id }
}

// Delete a product
export async function deleteProduct(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page to remove the deleted product
  revalidatePath("/admin/products")
  revalidatePath("/sklep")

  return { success: true }
}
