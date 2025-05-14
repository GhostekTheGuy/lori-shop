"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Type definitions
export type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
  hero_image: string | null
  created_at: string
  // Remove published field
}

export type CollectionFormData = {
  id?: string
  name: string
  slug: string
  description: string
  hero_image: string
  // Remove published field
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

// Get published collections
export async function getPublishedCollections() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  // Remove the filter for published column since it doesn't exist
  const { data, error } = await supabase.from("collections").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching published collections:", error)
    return []
  }

  return data as Collection[]
}

// Get featured collections
export async function getFeaturedCollections() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  // Remove the filter for published column since it doesn't exist
  const { data, error } = await supabase
    .from("collections")
    .select("*")
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

// Get collection with products
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
    .select("product_id, display_order")
    .eq("collection_id", collection.id)
    .order("display_order", { ascending: true })

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

  // Sort products according to the display_order
  const sortedProducts = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return {
    ...collection,
    products: sortedProducts,
  } as CollectionWithProducts
}

// Get featured products from a collection (limited)
export async function getFeaturedCollectionProducts(collectionId: string, limit = 2) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  // Get the products for this collection with limit
  const { data: collectionProducts, error: productsError } = await supabase
    .from("collection_products")
    .select("product_id, display_order")
    .eq("collection_id", collectionId)
    .order("display_order", { ascending: true })
    .limit(limit)

  if (productsError) {
    console.error("Error fetching collection products:", productsError)
    return []
  }

  if (collectionProducts.length === 0) {
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

  // Sort products according to the display_order
  const sortedProducts = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return sortedProducts
}

// Create a new collection
export async function createCollection(formData: CollectionFormData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Generate a unique ID if not provided
  const collectionId = formData.id || uuidv4()

  const { error } = await supabase.from("collections").insert({
    id: collectionId,
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    hero_image: formData.hero_image,
    // Remove published field
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
  const supabase = getSupabase()
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
      // Remove published field
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
  const supabase = getSupabase()
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

// Add product to collection
export async function addProductToCollection(collectionId: string, productId: string, displayOrder = 0) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("collection_products").insert({
    id: uuidv4(),
    collection_id: collectionId,
    product_id: productId,
    display_order: displayOrder,
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

// Remove product from collection
export async function removeProductFromCollection(collectionId: string, productId: string) {
  const supabase = getSupabase()
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

// Update product display order in collection
export async function updateProductDisplayOrder(collectionId: string, productId: string, displayOrder: number) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase
    .from("collection_products")
    .update({ display_order: displayOrder })
    .eq("collection_id", collectionId)
    .eq("product_id", productId)

  if (error) {
    console.error("Error updating product display order:", error)
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
