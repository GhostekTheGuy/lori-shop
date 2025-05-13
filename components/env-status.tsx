"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function EnvStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch("/api/check-supabase")
        const data = await response.json()

        if (data.success) {
          setStatus("success")
        } else {
          setStatus("error")
          setMessage(data.error || "Supabase connection failed")
        }
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Failed to check environment")
      }
    }

    checkEnv()
  }, [])

  if (status === "loading") {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 flex items-center">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        <span>Checking environment...</span>
      </div>
    )
  }

  if (status === "error") {
    return (
      <Alert className="fixed bottom-4 right-4 bg-red-50 border-red-200 max-w-md z-50">
        <AlertDescription className="text-red-800">
          <strong>Environment Error:</strong> {message}
          <div className="mt-2 text-sm">
            Visit{" "}
            <a href="/admin/setup" className="underline">
              setup page
            </a>{" "}
            for instructions.
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null // Don't show anything if successful
}
