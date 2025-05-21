"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function AdminDebugPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { user, isAdmin } = useAuth()

  const checkSession = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    const { data } = await supabase.auth.getSession()
    setSessionData({
      session: data.session,
      authContext: {
        user: user ? { id: user.id, email: user.email } : null,
        isAdmin,
      },
    })
  }

  const checkAdminAPI = async () => {
    setLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) return

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      const response = await fetch("/api/check-admin", {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
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
        console.error("Błąd odświeżania tokenu:", error)
        setApiResponse({ error: error.message })
      } else {
        console.log("Token odświeżony pomyślnie")
        setApiResponse({ message: "Token odświeżony pomyślnie", data })
        await checkSession()
      }
    } catch (error) {
      console.error("Nieoczekiwany błąd odświeżania tokenu:", error)
      setApiResponse({ error: String(error) })
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
          <CardTitle>Debugowanie Autoryzacji</CardTitle>
          <CardDescription>Rozwiązywanie problemów z autoryzacją</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={checkSession} variant="outline">
              Sprawdź Sesję
            </Button>
            <Button onClick={checkAdminAPI} variant="outline" disabled={loading}>
              Testuj API
            </Button>
            <Button onClick={refreshToken} variant="outline" disabled={loading}>
              Odśwież Token
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Sesja Klienta</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Odpowiedź API</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Jeszcze nie testowano"}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
