"use server"

import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Try to use a bucket that might already exist as fallback
const PRIMARY_BUCKET = "product-images"

export async function uploadProductImage(file: File) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Use the service role key for admin operations
    // This bypasses RLS policies for development/testing
    const adminSupabase = getSupabase(true) // Pass true to use service role key

    const bucketToUse = PRIMARY_BUCKET

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = fileName

    // Try to upload using admin privileges to bypass RLS
    const { error } = await adminSupabase.storage.from(bucketToUse).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)

      if (error.message?.includes("already exists")) {
        // Generate a new unique filename and try again
        const newFileName = `${uuidv4()}_${Date.now()}.${fileExt}`

        const { error: retryError } = await adminSupabase.storage.from(bucketToUse).upload(newFileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (retryError) {
          throw retryError
        }

        // Get public URL for the uploaded file
        const { data } = supabase.storage.from(bucketToUse).getPublicUrl(newFileName)
        return {
          success: true,
          url: data.publicUrl,
          bucket: bucketToUse,
        }
      }

      throw error
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage.from(bucketToUse).getPublicUrl(filePath)

    return {
      success: true,
      url: data.publicUrl,
      bucket: bucketToUse,
    }
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: error.message || "Failed to upload image. Please check your Supabase configuration and try again.",
    }
  }
}

export async function deleteProductImage(url: string) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Use admin privileges for deletion as well
    const adminSupabase = getSupabase(true)

    // Use the known bucket
    const bucketName = PRIMARY_BUCKET

    // Extract just the filename from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const filePath = pathParts[pathParts.length - 1]

    // Delete file from Supabase Storage
    const { error } = await adminSupabase.storage.from(bucketName).remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting image:", error)
    return { success: false, error: error.message || "Failed to delete image" }
  }
}
