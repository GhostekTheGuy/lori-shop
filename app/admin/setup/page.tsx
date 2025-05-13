"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminHeader } from "@/components/admin/admin-header"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "success" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [envVariables, setEnvVariables] = useState({
    supabaseUrl: false,
    supabaseAnonKey: false,
  })

  // Check environment variables and connection on load
  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = async () => {
    setConnectionStatus("checking")
    setErrorMessage(null)

    try {
      // Check if environment variables are set
      const response = await fetch("/api/check-supabase")
      const data = await response.json()

      setEnvVariables({
        supabaseUrl: data.supabaseUrl,
        supabaseAnonKey: data.supabaseAnonKey,
      })

      if (data.success) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
        setErrorMessage(data.error || "Unknown error")
      }
    } catch (error: any) {
      setConnectionStatus("error")
      setErrorMessage(error.message || "Failed to check Supabase connection")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Setup</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-medium mb-4">Environment Variables Status</h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${envVariables.supabaseUrl ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className="ml-2">{envVariables.supabaseUrl ? "Set" : "Not set"}</span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${envVariables.supabaseAnonKey ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className="ml-2">{envVariables.supabaseAnonKey ? "Set" : "Not set"}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Connection Status:</h3>
            {connectionStatus === "checking" && (
              <div className="flex items-center text-blue-600">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Checking connection...
              </div>
            )}

            {connectionStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">Successfully connected to Supabase!</AlertDescription>
              </Alert>
            )}

            {connectionStatus === "error" && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {errorMessage || "Failed to connect to Supabase"}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button onClick={checkEnvironmentVariables} className="bg-black hover:bg-gray-800">
            Refresh Connection Status
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Setup Instructions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Set up environment variables</h3>
              <p className="text-gray-600 mb-2">
                Make sure you have the following environment variables set in your project:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Create database tables</h3>
              <p className="text-gray-600 mb-2">
                Run the following SQL in your Supabase SQL Editor to create the necessary tables:
              </p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {`-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  category TEXT,
  stock_status TEXT DEFAULT 'in-stock',
  stock_quantity INTEGER,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  sku TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_intent TEXT,
  payment_status TEXT DEFAULT 'pending'
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT,
  color TEXT
);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
