"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "sm", className = "" }: LogoutButtonProps) {
  const { signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      console.log("Rozpoczęcie wylogowywania...")

      // Wywołaj funkcję wylogowania
      await signOut()

      // Dodatkowe zabezpieczenie - jeśli przekierowanie w signOut nie zadziała
      setTimeout(() => {
        console.log("Wymuszenie przekierowania po timeout...")
        router.push("/")

        // Ostateczne zabezpieczenie - użyj window.location.replace
        setTimeout(() => {
          window.location.replace("/")
        }, 500)
      }, 1000)
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error)
      // Nawet w przypadku błędu, spróbuj przekierować
      router.push("/")
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? (
        "Wylogowywanie..."
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Wyloguj
        </>
      )}
    </Button>
  )
}
