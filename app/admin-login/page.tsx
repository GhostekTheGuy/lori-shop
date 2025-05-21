"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldAlert, Lock } from "lucide-react"
import { getSupabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const { signIn, signOut, user, isAdmin } = useAuth()
  const router = useRouter()

  // Funkcja do sprawdzania statusu administratora
  const checkAdminStatus = useCallback(async () => {
    try {
      console.log("Sprawdzanie statusu administratora...")
      setDebugInfo("Sprawdzanie statusu administratora...")

      // Pobierz token dostępu
      const supabase = getSupabase()
      if (!supabase) {
        throw new Error("Nie można zainicjować klienta Supabase")
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("Brak tokenu dostępu")
      }

      setDebugInfo("Token dostępu uzyskany, wysyłanie żądania do API...")

      // Dodaj token do nagłówków żądania
      const response = await fetch("/api/check-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      const data = await response.json()
      setDebugInfo(`Odpowiedź API: ${JSON.stringify(data)}`)
      console.log("Odpowiedź sprawdzania administratora:", data)

      if (data.isAdmin) {
        setDebugInfo("Użytkownik jest administratorem, przekierowywanie...")
        // Przekierowanie do panelu administratora
        router.push("/admin")
      } else {
        setDebugInfo("Użytkownik nie jest administratorem")
        setError("Brak uprawnień administratora. Dostęp zabroniony.")
        // Wyloguj użytkownika bez uprawnień administratora
        await signOut()
      }
    } catch (err: any) {
      console.error("Błąd sprawdzania statusu administratora:", err)
      setDebugInfo(`Błąd: ${err.message}`)
      setError(`Wystąpił błąd podczas weryfikacji uprawnień administratora: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [router, signOut])

  // Sprawdź, czy jesteśmy już zalogowani
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabase()
        if (!supabase) return

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          console.log("Już zalogowany, sprawdzanie statusu administratora...")
          setIsLoading(true)
          await checkAdminStatus()
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania sesji:", error)
        setIsLoading(false)
      }
    }

    checkSession()
  }, [checkAdminStatus])

  // Obserwuj zmiany użytkownika i statusu administratora
  useEffect(() => {
    if (user && isAdmin) {
      console.log("Użytkownik zalogowany i jest administratorem, przekierowywanie...")
      router.push("/admin")
    }
  }, [user, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebugInfo(null)
    setIsLoading(true)

    try {
      // Najpierw wyloguj, aby wyczyścić istniejące sesje
      await signOut()

      // Następnie zaloguj się podanymi danymi
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      console.log("Logowanie pomyślne, sprawdzanie statusu administratora...")
      setDebugInfo("Logowanie pomyślne, sprawdzanie statusu administratora...")

      // Poczekaj chwilę, aby sesja została ustanowiona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sprawdź status administratora
      await checkAdminStatus()
    } catch (err: any) {
      console.error("Nieoczekiwany błąd podczas logowania:", err)
      setDebugInfo(`Nieoczekiwany błąd: ${err.message}`)
      setError(`Wystąpił nieoczekiwany błąd: ${err.message}`)
      setIsLoading(false)
    }
  }

  // Funkcja do bezpośredniego przekierowania do panelu administratora (do debugowania)
  const forceRedirect = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-black p-3 rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Panel Administratora</h2>
          <p className="mt-2 text-sm text-gray-600">Zaloguj się, aby uzyskać dostęp do panelu administratora</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert>
            <AlertDescription className="text-xs">{debugInfo}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <Label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email administratora
              </Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Email administratora"
              />
            </div>
            <div>
              <Label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                Hasło
              </Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Hasło"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się jako Administrator"
              )}
            </Button>

            {process.env.NODE_ENV === "development" && (
              <Button type="button" variant="outline" onClick={forceRedirect} className="text-xs">
                Wymuś przekierowanie (tylko dev)
              </Button>
            )}
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Powrót do sklepu
          </Link>
        </div>
      </div>
    </div>
  )
}
