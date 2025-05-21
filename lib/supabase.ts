import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: any = null

// Original function for backward compatibility
export function getSupabase(useServiceRole = false) {
  if (useServiceRole) {
    return getSupabaseAdmin()
  }
  return getSupabaseClient()
}

// Client-side Supabase client
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "phenotype-store-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseClient
}

// Admin Supabase client with service role
export function getSupabaseAdmin() {
  if (supabaseAdminClient) return supabaseAdminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase admin environment variables")
    return null
  }

  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseAdminClient
}

// Server-side Supabase client with cookie handling
export async function getServerSupabase(cookieHeader?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  // If we have a cookie header, use it to initialize the client with the session
  if (cookieHeader) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          cookie: cookieHeader,
        },
      },
    })
  }

  // Otherwise, use the service role key for admin operations if available
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  // Fallback to anon key
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// For backward compatibility
export const supabase = getSupabaseClient()

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
      // Other table definitions remain the same
    }
  }
}
