"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Type for product form data
export type ProductFormData = {
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

export type Product = {
  id: string
  name: string
  description: string
  price: number
  sale_price: number | null
  category_id?: string
  category?: string
  stock_status: "in-stock" | "low-stock" | "sold-out"
  stock_quantity: number | null
  images: string[]
  tags: string[]
  featured: boolean
  published: boolean
  sku: string
  sizes: string[]
  colors: string[]
  created_at: string
}

// Get all products
export async function getProducts() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

// Get all products for admin (including unpublished)
export async function getAllProductsForAdmin() {
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

  return data as Product[]
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

  return data as Product[]
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

  return data as Product
}

// Get products by category
export async function getProductsByCategory(category: string, limit?: number) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    let query

    if (category === "all") {
      // If "all" category, get all published products
      query = supabase.from("products").select("*").eq("published", true).order("created_at", { ascending: false })
    } else {
      // Otherwise, join with categories to find products in the specified category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single()

      if (categoryError || !categoryData) {
        console.error("Error finding category:", categoryError)
        return []
      }

      // Get products with the matching category_id
      query = supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryData.id)
        .eq("published", true)
        .order("created_at", { ascending: false })
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching products by category:", error)
      return []
    }

    // Transform the data to ensure images is an array
    return data.map((product) => ({
      ...product,
      images: Array.isArray(product.images) ? product.images : [product.images],
    }))
  } catch (error) {
    console.error("Error in getProductsByCategory:", error)
    return []
  }
}

// Search products
export async function searchProducts(query: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return data as Product[]
}

// Create a new product
export async function createProduct(formData: ProductFormData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Generate a unique ID if not provided
  const productId = formData.id || uuidv4()

  try {
    // First, check if we need to convert category to category_id
    let categoryId = null
    if (formData.category) {
      // Check if categories table exists and try to find the category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", formData.category)
        .single()

      if (!categoryError && categoryData) {
        categoryId = categoryData.id
      }
    }

    // Prepare product data, checking which fields exist in the database
    const productData: any = {
      id: productId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      sale_price: formData.salePrice,
      stock_status: formData.stockStatus,
      stock_quantity: formData.stockQuantity,
      images: formData.images,
      tags: formData.tags,
      featured: formData.featured,
      published: formData.published,
      sku: formData.sku,
      sizes: formData.sizes,
      colors: formData.colors,
    }

    // Add category_id if we found one
    if (categoryId) {
      productData.category_id = categoryId
    }

    // Try to add the product
    const { error } = await supabase.from("products").insert(productData)

    if (error) {
      console.error("Error creating product:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the products page to show the new product
    revalidatePath("/admin/products")
    revalidatePath("/sklep")
    revalidatePath("/")

    return { success: true, productId }
  } catch (error: any) {
    console.error("Error in createProduct:", error)
    return { success: false, error: error.message }
  }
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

  try {
    // First, check if we need to convert category to category_id
    let categoryId = null
    if (formData.category) {
      // Check if categories table exists and try to find the category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", formData.category)
        .single()

      if (!categoryError && categoryData) {
        categoryId = categoryData.id
      }
    }

    // Prepare product data, checking which fields exist in the database
    const productData: any = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      sale_price: formData.salePrice,
      stock_status: formData.stockStatus,
      stock_quantity: formData.stockQuantity,
      images: formData.images,
      tags: formData.tags,
      featured: formData.featured,
      published: formData.published,
      sku: formData.sku,
      sizes: formData.sizes,
      colors: formData.colors,
    }

    // Add category_id if we found one
    if (categoryId) {
      productData.category_id = categoryId
    }

    const { error } = await supabase.from("products").update(productData).eq("id", formData.id)

    if (error) {
      console.error("Error updating product:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the products page to show the updated product
    revalidatePath("/admin/products")
    revalidatePath(`/product/${formData.id}`)
    revalidatePath("/sklep")
    revalidatePath("/")

    return { success: true, productId: formData.id }
  } catch (error: any) {
    console.error("Error in updateProduct:", error)
    return { success: false, error: error.message }
  }
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
  revalidatePath("/")

  return { success: true }
}

// Get available product categories
export async function getProductCategories(): Promise<string[]> {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  try {
    // First, check if we have any categories in the categories table
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("slug")
      .order("name", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return []
    }

    // If we have categories, return their slugs
    if (categoriesData && categoriesData.length > 0) {
      // Always include "all" category
      const categories = new Set<string>(["all"])

      // Add other category slugs
      categoriesData.forEach((category) => {
        if (category.slug) {
          categories.add(category.slug)
        }
      })

      return Array.from(categories)
    }

    // Fallback: If no categories found, return just "all"
    return ["all"]
  } catch (error) {
    console.error("Error in getProductCategories:", error)
    return ["all"] // Return at least "all" as a fallback
  }
}
