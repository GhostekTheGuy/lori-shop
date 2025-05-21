"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { LogOut, RefreshCw, Home, Bug } from "lucide-react"

export default function AuthDebugPage() {
  const { user, session, isAdmin, signOut } = useAuth()
  const [sessionData, setSessionData] = useState<any>(null)
  const [cookieData, setCookieData] = useState<string>("")
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  const [testApiResult, setTestApiResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Pobierz dane sesji
    const fetchSessionData = async () => {
      const supabase = getSupabase()
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        setSessionData(data)
      }
    }

    // Pobierz dane ciasteczek
    const getCookies = () => {
      setCookieData(document.cookie)
    }

    // Pobierz dane localStorage
    const getLocalStorage = () => {
      const data: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          data[key] = localStorage.getItem(key) || ""
        }
      }
      setLocalStorageData(data)
    }

    fetchSessionData()
    getCookies()
    getLocalStorage()
  }, [])

  const handleTestApi = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      const response = await fetch("/api/check-admin", {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()
      setTestApiResult(data)
    } catch (error: any) {
      setTestApiResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshToken = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error

      setSessionData({ session: data.session })
      setTestApiResult({ message: "Token odświeżony pomyślnie", data })
    } catch (error: any) {
      setTestApiResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForceLogout = async () => {
    try {
      // 1. Wyczyść localStorage
      localStorage.clear()

      // 2. Wyczyść ciasteczka
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/;domain=${window.location.hostname}`)
      })

      // 3. Wywołaj signOut
      await signOut()

      // 4. Przekieruj na stronę główną
      window.location.replace("/")
    } catch (error) {
      console.error("Błąd podczas wymuszania wylogowania:", error)
      // Nawet w przypadku błędu, przekieruj
      window.location.replace("/")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" /> Narzędzie debugowania autoryzacji
          </CardTitle>
          <CardDescription>Ta strona pomaga zdiagnozować problemy z autoryzacją i sesją użytkownika.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Status użytkownika</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                <strong>Zalogowany:</strong> {user ? "Tak" : "Nie"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Brak"}
              </p>
              <p>
                <strong>ID użytkownika:</strong> {user?.id || "Brak"}
              </p>
              <p>
                <strong>Administrator:</strong> {isAdmin ? "Tak" : "Nie"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Dane sesji</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(sessionData, null, 2)}</pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Ciasteczka</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto max-h-40">
              <pre className="text-xs">{cookieData || "Brak ciasteczek"}</pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">LocalStorage</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(localStorageData, null, 2)}</pre>
            </div>
          </div>

          {testApiResult && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">Wynik testu API</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto max-h-40">
                  <pre className="text-xs">{JSON.stringify(testApiResult, null, 2)}</pre>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handleTestApi} disabled={isLoading}>
            Testuj API
          </Button>
          <Button onClick={handleRefreshToken} disabled={isLoading} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Odśwież token
          </Button>
          <Button onClick={handleForceLogout} variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Wymuś wylogowanie
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="secondary">
            <Home className="h-4 w-4 mr-2" />
            Strona główna
          </Button>
        </CardFooter>
      </Card>

      <Alert className="mt-6">
        <AlertTitle>Wskazówka</AlertTitle>
        <AlertDescription>
          Jeśli masz problemy z logowaniem lub wylogowywaniem, spróbuj wyczyścić pamięć podręczną przeglądarki i
          ciasteczka, a następnie zaloguj się ponownie.
        </AlertDescription>
      </Alert>
    </div>
  )
}
