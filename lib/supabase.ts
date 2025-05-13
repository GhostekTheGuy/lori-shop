import { createClient } from "@supabase/supabase-js"

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug environment variables (only in development)
if (process.env.NODE_ENV !== "production") {
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set")
  console.log("Supabase Anon Key:", supabaseAnonKey ? "Set" : "Not set")
}

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
      console.log("Supabase client initialized successfully")
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      return null
    }
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabase()

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          sale_price: number | null
          category: string
          stock_status: "in-stock" | "low-stock" | "sold-out"
          stock_quantity: number | null
          images: string[]
          tags: string[]
          featured: boolean
          published: boolean
          sku: string
          sizes: string[]
          colors: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          sale_price?: number | null
          category?: string
          stock_status?: "in-stock" | "low-stock" | "sold-out"
          stock_quantity?: number | null
          images?: string[]
          tags?: string[]
          featured?: boolean
          published?: boolean
          sku?: string
          sizes?: string[]
          colors?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          sale_price?: number | null
          category?: string
          stock_status?: "in-stock" | "low-stock" | "sold-out"
          stock_quantity?: number | null
          images?: string[]
          tags?: string[]
          featured?: boolean
          published?: boolean
          sku?: string
          sizes?: string[]
          colors?: string[]
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total: number
          shipping_address: {
            first_name: string
            last_name: string
            address: string
            city: string
            postal_code: string
            country: string
            phone: string
          }
          payment_intent: string | null
          payment_status: "pending" | "paid" | "failed"
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total: number
          shipping_address: {
            first_name: string
            last_name: string
            address: string
            city: string
            postal_code: string
            country: string
            phone: string
          }
          payment_intent?: string | null
          payment_status?: "pending" | "paid" | "failed"
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          total?: number
          shipping_address?: {
            first_name: string
            last_name: string
            address: string
            city: string
            postal_code: string
            country: string
            phone: string
          }
          payment_intent?: string | null
          payment_status?: "pending" | "paid" | "failed"
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size: string | null
          color: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          size?: string | null
          color?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: {
            address: string
            city: string
            postal_code: string
            country: string
          } | null
          is_admin: boolean
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: {
            address: string
            city: string
            postal_code: string
            country: string
          } | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: {
            address: string
            city: string
            postal_code: string
            country: string
          } | null
          is_admin?: boolean
        }
      }
    }
  }
}
