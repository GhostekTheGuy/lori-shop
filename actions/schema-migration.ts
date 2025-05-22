"use server"

import { getSupabase } from "@/lib/supabase"

export async function addCategoryColumnToProducts() {
  try {
    const supabase = getSupabase(true) // Use admin client
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Check if the column already exists
    const { data: columnExists, error: checkError } = await supabase.rpc("check_column_exists", {
      table_name: "products",
      column_name: "category",
    })

    if (checkError) {
      console.error("Error checking if column exists:", checkError)

      // If the function doesn't exist, create it first
      await supabase.rpc("create_check_column_function")

      // Try again after creating the function
      const { data: retryColumnExists } = await supabase.rpc("check_column_exists", {
        table_name: "products",
        column_name: "category",
      })

      if (!retryColumnExists) {
        // Add the column if it doesn't exist
        const { error: alterError } = await supabase.rpc("add_column_to_table", {
          table_name: "products",
          column_name: "category",
          column_type: "text",
        })

        if (alterError) {
          console.error("Error adding column:", alterError)
          return { success: false, error: alterError.message }
        }
      }
    } else if (!columnExists) {
      // Add the column if it doesn't exist
      const { error: alterError } = await supabase.rpc("add_column_to_table", {
        table_name: "products",
        column_name: "category",
        column_type: "text",
      })

      if (alterError) {
        console.error("Error adding column:", alterError)
        return { success: false, error: alterError.message }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in migration:", error)
    return { success: false, error: error.message }
  }
}

export async function createDatabaseFunctions() {
  try {
    const supabase = getSupabase(true) // Use admin client
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // Create function to check if a column exists
    const { error: createCheckFunctionError } = await supabase.rpc("create_check_column_function")
    if (createCheckFunctionError) {
      console.error("Error creating check column function:", createCheckFunctionError)
      // Function might already exist, continue
    }

    // Create function to add a column to a table
    const { error: createAddColumnFunctionError } = await supabase.rpc("create_add_column_function")
    if (createAddColumnFunctionError) {
      console.error("Error creating add column function:", createAddColumnFunctionError)
      // Function might already exist, continue
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error creating database functions:", error)
    return { success: false, error: error.message }
  }
}

export async function runAllMigrations() {
  // First create the necessary database functions
  const functionsResult = await createDatabaseFunctions()
  if (!functionsResult.success) {
    return functionsResult
  }

  // Then run the migrations
  const categoryResult = await addCategoryColumnToProducts()
  if (!categoryResult.success) {
    return categoryResult
  }

  return { success: true }
}
