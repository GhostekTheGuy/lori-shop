"use server"

import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function uploadProductImage(file: File) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `products/${fileName}`

    // Upload file to Supabase Storage
    const { error } = await supabase.storage.from("product-images").upload(filePath, file)

    if (error) {
      throw error
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return { success: true, url: data.publicUrl }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

export async function deleteProductImage(url: string) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const filePath = pathParts.slice(pathParts.indexOf("product-images") + 1).join("/")

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from("product-images").remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, error: "Failed to delete image" }
  }
}
