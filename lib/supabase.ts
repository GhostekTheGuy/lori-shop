import { createClient } from "@supabase/supabase-js"
import type { Database as DB } from "@/types/supabase"

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: any = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  supabaseClient = createClient<DB>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "phenotype-store-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce", // More secure flow type
    },
  })

  return supabaseClient
}

// Server-side Supabase client
export function getSupabase(useServiceRole = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or key is missing")
    return null
  }

  // Return existing instance if available
  if (useServiceRole) {
    if (!supabaseAdminClient) {
      supabaseAdminClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
      })
    }
    return supabaseAdminClient
  } else {
    return createClient<DB>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Don't persist session on server
      },
    })
  }
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
