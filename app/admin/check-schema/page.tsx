"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CheckSchemaPage() {
  const [schema, setSchema] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkSchema = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      // Check products table schema
      const { data: productsSchema, error: productsError } = await supabase.rpc("get_table_schema", {
        table_name: "products",
      })

      if (productsError) {
        throw new Error(`Error fetching products schema: ${productsError.message}`)
      }

      setSchema(productsSchema)
    } catch (err: any) {
      console.error("Error checking schema:", err)
      setError(err.message || "Failed to check schema")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Create the function if it doesn't exist
    const createFunction = async () => {
      try {
        const supabase = createClientComponentClient()

        // Create a function to get table schema
        await supabase.rpc("create_schema_function")

        // Now check the schema
        checkSchema()
      } catch (err) {
        console.error("Error creating function:", err)
        setError("Failed to create schema function. Please check console for details.")
        setLoading(false)
      }
    }

    createFunction()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Database Schema Check</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <Button onClick={checkSchema} disabled={loading}>
          {loading ? "Checking..." : "Refresh Schema"}
        </Button>
      </div>

      {schema && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Products Table Schema</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(schema, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
