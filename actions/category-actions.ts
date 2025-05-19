"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"

// Pobierz wszystkie kategorie
export async function getCategories() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

// Pobierz kategorię po ID
export async function getCategoryById(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}

// Utwórz nową kategorię
export async function createCategory(categoryData: {
  name: string
  slug: string
  description?: string
}) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("categories").insert([categoryData])

  if (error) {
    console.error("Error creating category:", error)
    return { success: false, error: error.message }
  }

  // Odśwież stronę kategorii
  revalidatePath("/admin/categories")

  return { success: true }
}

// Zaktualizuj kategorię
export async function updateCategory(
  id: string,
  categoryData: {
    name: string
    slug: string
    description?: string
  },
) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("categories").update(categoryData).eq("id", id)

  if (error) {
    console.error("Error updating category:", error)
    return { success: false, error: error.message }
  }

  // Odśwież stronę kategorii
  revalidatePath("/admin/categories")
  revalidatePath(`/admin/categories/edit/${id}`)

  return { success: true }
}

// Usuń kategorię
export async function deleteCategory(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Sprawdź, czy kategoria jest używana przez produkty
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id)
    .limit(1)

  if (productsError) {
    console.error("Error checking products:", productsError)
    return { success: false, error: "Failed to check if category is in use" }
  }

  if (products && products.length > 0) {
    return {
      success: false,
      error: "This category cannot be deleted because it is associated with products",
    }
  }

  // Usuń kategorię
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: error.message }
  }

  // Odśwież stronę kategorii
  revalidatePath("/admin/categories")

  return { success: true }
}
