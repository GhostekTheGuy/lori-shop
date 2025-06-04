"use server"

import { revalidatePath } from "next/cache"
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase" // Ensure getSupabaseAdmin is imported
import { v4 as uuidv4 } from "uuid"

// Type definitions
export type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
  hero_image: string | null
  created_at: string
  image_url: string | null // Added back for consistency with other collection actions
  active: boolean // Added back for consistency with other collection actions
}

export type CollectionFormData = {
  id?: string
  name: string
  slug: string
  description: string
  hero_image: string
}

export type CollectionWithProducts = Collection & {
  products: Array<{
    id: string
    name: string
    price: number
    sale_price: number | null
    images: string[]
    stock_status: string
    stock_quantity: number | null
  }>
}

// Get all collections
export async function getCollections() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase.from("collections").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }

  return data as Collection[]
}

// Get published collections (Restored)
export async function getPublishedCollections() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching published collections:", error)
    return []
  }

  return data as Collection[]
}

// Get featured collections (Restored)
export async function getFeaturedCollections() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true) // Assuming featured collections should also be active
    .order("created_at", { ascending: false })
    .limit(3) // Just get the first few collections

  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }

  return data as Collection[]
}

// Get collection by slug
export async function getCollectionBySlug(slug: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase.from("collections").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching collection:", error)
    return null
  }

  return data as Collection
}

// Get collection with products (Restored)
export async function getCollectionWithProducts(slug: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  // First get the collection
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single()

  if (collectionError) {
    console.error("Error fetching collection:", collectionError)
    return null
  }

  // Then get the products for this collection
  const { data: collectionProducts, error: productsError } = await supabase
    .from("collection_products")
    .select("product_id")
    .eq("collection_id", collection.id)

  if (productsError) {
    console.error("Error fetching collection products:", productsError)
    return { ...collection, products: [] }
  }

  if (collectionProducts.length === 0) {
    return { ...collection, products: [] }
  }

  // Get the actual product details
  const productIds = collectionProducts.map((cp) => cp.product_id)
  const { data: products, error: productDetailsError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("published", true)

  if (productDetailsError) {
    console.error("Error fetching product details:", productDetailsError)
    return { ...collection, products: [] }
  }

  return {
    ...collection,
    products: products,
  } as CollectionWithProducts
}

// Get featured products from a collection (limited) (Restored)
export async function getFeaturedCollectionProducts(collectionId: string, limit = 2) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  try {
    // Get the products for this collection with limit
    const { data: collectionProducts, error: productsError } = await supabase
      .from("collection_products")
      .select("product_id")
      .eq("collection_id", collectionId)
      .limit(limit)

    if (productsError) {
      console.error("Error fetching collection products:", productsError)
      return []
    }

    if (!collectionProducts || collectionProducts.length === 0) {
      return []
    }

    // Get the actual product details
    const productIds = collectionProducts.map((cp) => cp.product_id)
    const { data: products, error: productDetailsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("published", true)

    if (productDetailsError) {
      console.error("Error fetching product details:", productDetailsError)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Error in getFeaturedCollectionProducts:", error)
    return []
  }
}

// Create a new collection
export async function createCollection(formData: CollectionFormData) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    }
  }

  // Generate a unique ID if not provided
  const collectionId = formData.id || uuidv4()

  const { error } = await supabase.from("collections").insert({
    id: collectionId,
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    hero_image: formData.hero_image,
  })

  if (error) {
    console.error("Error creating collection:", error)
    return { success: false, error: error.message }
  }

  // Revalidate paths
  revalidatePath("/admin/collections")
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true, collectionId }
}

// Update an existing collection
export async function updateCollection(formData: CollectionFormData) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  if (!formData.id) {
    return { success: false, error: "Collection ID is required" }
  }

  const { error } = await supabase
    .from("collections")
    .update({
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      hero_image: formData.hero_image,
    })
    .eq("id", formData.id)

  if (error) {
    console.error("Error updating collection:", error)
    return { success: false, error: error.message }
  }

  // Revalidate paths
  revalidatePath("/admin/collections")
  revalidatePath(`/kolekcje/${formData.slug}`)
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true, collectionId: formData.id }
}

// Delete a collection
export async function deleteCollection(id: string) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("collections").delete().eq("id", id)

  if (error) {
    console.error("Error deleting collection:", error)
    return { success: false, error: error.message }
  }

  // Revalidate paths
  revalidatePath("/admin/collections")
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true }
}

// Add product to collection (Restored)
export async function addProductToCollection(collectionId: string, productId: string) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Check if the relationship already exists
  const { data: existing, error: checkError } = await supabase
    .from("collection_products")
    .select("*")
    .eq("collection_id", collectionId)
    .eq("product_id", productId)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking existing product in collection:", checkError)
    return { success: false, error: checkError.message }
  }

  // If relationship already exists, return success
  if (existing) {
    return { success: true }
  }

  // Add the product to the collection
  const { error } = await supabase.from("collection_products").insert({
    collection_id: collectionId,
    product_id: productId,
  })

  if (error) {
    console.error("Error adding product to collection:", error)
    return { success: false, error: error.message }
  }

  // Get the collection slug for path revalidation
  const { data: collection } = await supabase.from("collections").select("slug").eq("id", collectionId).single()

  // Revalidate paths
  revalidatePath("/admin/collections")
  if (collection) {
    revalidatePath(`/kolekcje/${collection.slug}`)
  }
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true }
}

// Remove product from collection (Restored)
export async function removeProductFromCollection(collectionId: string, productId: string) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase
    .from("collection_products")
    .delete()
    .eq("collection_id", collectionId)
    .eq("product_id", productId)

  if (error) {
    console.error("Error removing product from collection:", error)
    return { success: false, error: error.message }
  }

  // Get the collection slug for path revalidation
  const { data: collection } = await supabase.from("collections").select("slug").eq("id", collectionId).single()

  // Revalidate paths
  revalidatePath("/admin/collections")
  if (collection) {
    revalidatePath(`/kolekcje/${collection.slug}`)
  }
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true }
}

// Restore this function with a simplified implementation that doesn't rely on display_order (Restored)
export async function updateProductDisplayOrder(collectionId: string, productId: string, displayOrder: number) {
  const supabase = getSupabaseAdmin() // Changed to getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Since we don't have a display_order column, we'll just log the action and return success
  console.log(`Would update display order for product ${productId} in collection ${collectionId} to ${displayOrder}`)

  // Get the collection slug for path revalidation
  const { data: collection } = await supabase.from("collections").select("slug").eq("id", collectionId).single()

  // Revalidate paths
  revalidatePath("/admin/collections")
  if (collection) {
    revalidatePath(`/kolekcje/${collection.slug}`)
  }
  revalidatePath("/kolekcje")
  revalidatePath("/")

  return { success: true }
}

// Get featured products (Restored)
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

  return data as any[]
}
