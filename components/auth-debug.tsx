"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AuthDebug() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSession = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    const { data } = await supabase.auth.getSession()
    setSessionData(data)
  }

  const checkAdminAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/check-admin", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })

      const data = await response.json()
      setApiResponse({
        status: response.status,
        data,
      })
    } catch (error) {
      setApiResponse({
        error: String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    setLoading(true)
    const supabase = getSupabase()
    if (!supabase) return

    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing token:", error)
      } else {
        console.log("Token refreshed successfully")
        await checkSession()
      }
    } catch (error) {
      console.error("Unexpected error refreshing token:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Troubleshoot authentication issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={checkSession} variant="outline">
              Check Session
            </Button>
            <Button onClick={checkAdminAPI} variant="outline" disabled={loading}>
              Test API
            </Button>
            <Button onClick={refreshToken} variant="outline" disabled={loading}>
              Refresh Token
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Client Session</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">API Response</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Not tested yet"}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
