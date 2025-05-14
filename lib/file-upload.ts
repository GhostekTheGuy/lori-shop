"use server"

import { getSupabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Try to use a bucket that might already exist as fallback
const PRIMARY_BUCKET = "product-images"
const FALLBACK_BUCKET = "public" // Many Supabase instances have this bucket by default

export async function uploadProductImage(file: File) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Check which buckets exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return {
        success: false,
        error: "Unable to access storage. Please check your Supabase configuration.",
      }
    }

    // Determine which bucket to use
    let bucketToUse = null
    if (buckets?.some((b) => b.name === PRIMARY_BUCKET)) {
      bucketToUse = PRIMARY_BUCKET
    } else if (buckets?.some((b) => b.name === FALLBACK_BUCKET)) {
      bucketToUse = FALLBACK_BUCKET
    }

    if (!bucketToUse) {
      return {
        success: false,
        error: `No available storage buckets found. Please create either "${PRIMARY_BUCKET}" or "${FALLBACK_BUCKET}" bucket in your Supabase dashboard.`,
      }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = bucketToUse === PRIMARY_BUCKET ? fileName : `products/${fileName}`

    // Upload file to Supabase Storage
    const { error } = await supabase.storage.from(bucketToUse).upload(filePath, file)

    if (error) {
      console.error("Upload error:", error)

      // Check for specific error types
      if (error.message?.includes("Permission") || error.message?.includes("policy")) {
        return {
          success: false,
          error: `Permission denied. Please ensure your RLS policies allow uploads to the "${bucketToUse}" bucket.`,
        }
      }

      if (error.message?.includes("already exists")) {
        // Generate a new unique filename and try again
        const newFileName = `${uuidv4()}_${Date.now()}.${fileExt}`
        const newFilePath = bucketToUse === PRIMARY_BUCKET ? newFileName : `products/${newFileName}`

        const { error: retryError } = await supabase.storage.from(bucketToUse).upload(newFilePath, file)

        if (retryError) {
          throw retryError
        }

        // Get public URL for the uploaded file
        const { data } = supabase.storage.from(bucketToUse).getPublicUrl(newFilePath)
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
      bucket: bucketToUse, // Return which bucket was used for reference
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

    // Determine which bucket the file is in based on the URL
    let bucketName = PRIMARY_BUCKET
    let filePath = ""

    if (url.includes(`/${PRIMARY_BUCKET}/`)) {
      bucketName = PRIMARY_BUCKET
      filePath = url.split(`/${PRIMARY_BUCKET}/`)[1]
    } else if (url.includes(`/${FALLBACK_BUCKET}/`)) {
      bucketName = FALLBACK_BUCKET
      filePath = url.split(`/${FALLBACK_BUCKET}/`)[1]
    } else {
      // If we can't determine the bucket from the URL, extract just the filename
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")
      filePath = pathParts[pathParts.length - 1]

      // If it's in the fallback bucket with a products/ prefix
      if (bucketName === FALLBACK_BUCKET) {
        filePath = `products/${filePath}`
      }
    }

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting image:", error)
    return { success: false, error: error.message || "Failed to delete image" }
  }
}
