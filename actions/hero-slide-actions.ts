"use server"

import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export type HeroSlide = {
  id: string
  title: string
  subtitle: string | null
  image: string
  display_order: number
  active: boolean
  created_at?: string
  collection_id: string | null
  collection_slug?: string | null
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*, collections(slug)")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching hero slides:", error)
    return []
  }

  const mappedData = data.map((slide: any) => ({
    ...slide,
    collection_slug: slide.collections?.slug || null,
  }))

  return mappedData as HeroSlide[]
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*, collections(slug)")
    .eq("active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching active hero slides:", error)
    return []
  }

  const mappedData = data.map((slide: any) => ({
    ...slide,
    collection_slug: slide.collections?.slug || null,
  }))

  return mappedData as HeroSlide[]
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase.from("hero_slides").select("*, collections(slug)").eq("id", id).single()

  if (error) {
    console.error("Error fetching hero slide:", error)
    return null
  }

  const mappedData = {
    ...data,
    collection_slug: data.collections?.slug || null,
  }

  return mappedData as HeroSlide
}

export async function createHeroSlide(formData: FormData): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, message: "Supabase client not initialized" }
  }

  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const image = formData.get("image") as string
  const displayOrder = Number.parseInt(formData.get("display_order") as string) || 0
  // Correctly check if the switch is "on" (checked)
  const active = formData.get("active") === "on"
  const collectionId = (formData.get("collection_id") as string) || null

  if (!title || !image) {
    return { success: false, message: "Title and image are required" }
  }

  const { error } = await supabase.from("hero_slides").insert({
    id: uuidv4(),
    title,
    subtitle,
    image,
    display_order: displayOrder,
    active,
    collection_id: collectionId,
  })

  if (error) {
    console.error("Error creating hero slide:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")

  return { success: true, message: "Hero slide created successfully" }
}

export async function updateHeroSlide(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, message: "Supabase client not initialized" }
  }

  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const image = formData.get("image") as string
  const displayOrder = Number.parseInt(formData.get("display_order") as string) || 0
  // Correctly check if the switch is "on" (checked)
  const active = formData.get("active") === "on"
  const collectionId = (formData.get("collection_id") as string) || null

  if (!title || !image) {
    return { success: false, message: "Title and image are required" }
  }

  const { error } = await supabase
    .from("hero_slides")
    .update({
      title,
      subtitle,
      image,
      display_order: displayOrder,
      active,
      collection_id: collectionId,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating hero slide:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")

  return { success: true, message: "Hero slide updated successfully" }
}

export async function deleteHeroSlide(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, message: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("hero_slides").delete().eq("id", id)

  if (error) {
    console.error("Error deleting hero slide:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")

  return { success: true, message: "Hero slide deleted successfully" }
}
