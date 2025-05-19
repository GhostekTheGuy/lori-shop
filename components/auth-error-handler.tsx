"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AuthErrorHandler() {
  const [hasAuthError, setHasAuthError] = useState(false)
  const { signOut } = useAuth()

  useEffect(() => {
    // Sprawdź, czy w konsoli są błędy związane z autoryzacją
    const originalConsoleError = console.error

    console.error = (...args) => {
      const errorString = args.join(" ")
      if (
        errorString.includes("refresh_token_not_found") ||
        errorString.includes("AuthApiError") ||
        errorString.includes("JWT expired")
      ) {
        setHasAuthError(true)
      }
      originalConsoleError.apply(console, args)
    }

    // Przywróć oryginalną funkcję console.error przy odmontowaniu komponentu
    return () => {
      console.error = originalConsoleError
    }
  }, [])

  // Jeśli wykryto błąd autoryzacji, wyświetl alert i wyloguj użytkownika
  useEffect(() => {
    if (hasAuthError) {
      const timer = setTimeout(() => {
        signOut()
        window.location.href = "/login?error=session_expired"
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [hasAuthError, signOut])

  if (!hasAuthError) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Błąd sesji</AlertTitle>
        <AlertDescription>
          Twoja sesja wygasła lub jest nieprawidłowa. Za chwilę zostaniesz przekierowany do strony logowania.
        </AlertDescription>
      </Alert>
    </div>
  )
}
