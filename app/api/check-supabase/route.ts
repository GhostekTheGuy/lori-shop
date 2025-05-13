import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envStatus = {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
    success: false,
    error: null,
  }

  // If environment variables are missing, return early
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      ...envStatus,
      error: "Missing Supabase environment variables",
    })
  }

  try {
    // Try to initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test the connection with a simple query
    const { error } = await supabase.from("_test_connection").select("*").limit(1).maybeSingle()

    // If there's an error but it's just that the table doesn't exist, that's fine
    // It means we can connect to Supabase
    if (error && !error.message.includes("does not exist")) {
      return NextResponse.json({
        ...envStatus,
        error: `Connection error: ${error.message}`,
      })
    }

    return NextResponse.json({
      ...envStatus,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      ...envStatus,
      error: `Failed to connect: ${error.message}`,
    })
  }
}
