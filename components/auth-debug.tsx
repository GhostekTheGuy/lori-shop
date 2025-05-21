"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user, session, isAdmin } = useAuth()

  const checkAuthState = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setDebugInfo({ error: "Supabase client not initialized" })
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()

      // Check admin status via API
      let adminCheckResult = null
      try {
        const response = await fetch("/api/check-admin", {
          headers: { "Cache-Control": "no-cache" },
        })
        adminCheckResult = {
          status: response.status,
          data: await response.json(),
        }
      } catch (error) {
        adminCheckResult = { error: String(error) }
      }

      setDebugInfo({
        clientState: {
          user: user ? { id: user.id, email: user.email } : null,
          isAdmin,
          hasSession: !!session,
        },
        supabaseSession: sessionData,
        adminApiCheck: adminCheckResult,
        localStorage: typeof window !== "undefined" ? Object.keys(localStorage) : null,
        cookies: typeof document !== "undefined" ? document.cookie : null,
      })
    } catch (error) {
      setDebugInfo({ error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={checkAuthState} disabled={isLoading} variant="outline" className="mb-4">
          {isLoading ? "Checking..." : "Check Auth State"}
        </Button>

        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
