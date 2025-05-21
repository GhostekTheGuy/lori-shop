"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  const { signIn, signOut } = useAuth()
  const router = useRouter()

  // Check if we're already logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase()
      if (!supabase) return

      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log("Already logged in, checking admin status...")
        checkAdminStatus(data.session.access_token)
      }
    }

    checkSession()
  }, [])

  const checkAdminStatus = async (token?: string) => {
    try {
      setIsLoading(true)

      // Force a refresh of the session token before checking admin status
      const supabase = getSupabase()
      if (supabase) {
        const { data } = await supabase.auth.refreshSession()
        token = data.session?.access_token || token
      }

      // Add the token to the request headers
      const headers: HeadersInit = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch("/api/check-admin", {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error checking admin status")
      }

      const data = await response.json()
      console.log("Admin check response:", data)

      if (data.isAdmin) {
        // Redirect to admin panel
        router.push("/admin")
      } else {
        // User is not an admin
        setError("Brak uprawnień administratora. Dostęp zabroniony.")
        // Log out non-admin user
        await signOut()
      }
    } catch (err: any) {
      console.error("Admin check error:", err)
      setError(`Wystąpił błąd podczas weryfikacji uprawnień administratora: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // First, sign out to clear any existing sessions
      await signOut()

      // Then sign in with the provided credentials
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      // Add a console log to help with debugging
      console.log("Sign in successful, checking admin status...")

      // Get the session to extract the token
      const supabase = getSupabase()
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      // Wait a moment for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 500))

      await checkAdminStatus(token)
    } catch (err: any) {
      console.error("Unexpected error during login:", err)
      setError(`Wystąpił nieoczekiwany błąd: ${err.message}`)
      setIsLoading(false)
    }
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

          <div>
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
