"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"

// Get all users for admin
export async function getUsers() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase.from("users").select("*").order("email", { ascending: true })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data
}

// Get user by ID
export async function getUserById(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: {
      address: string
      city: string
      postalCode: string
      country: string
    }
  },
) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase
    .from("users")
    .update({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone: profileData.phone,
      address: profileData.address,
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the user profile page
  revalidatePath(`/account`)

  return { success: true }
}

// Update user admin status (admin only)
export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("users").update({ is_admin: isAdmin }).eq("id", userId)

  if (error) {
    console.error("Error updating user admin status:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the users page
  revalidatePath("/admin/users")

  return { success: true }
}
