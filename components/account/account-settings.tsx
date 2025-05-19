"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const { resetPassword } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleResetPassword = async () => {
    try {
      setIsChangingPassword(true)
      const { error } = await resetPassword(user.email || "")
      if (error) {
        throw error
      }
      setIsResetEmailSent(true)
      toast({
        title: "Email wysłany",
        description: "Sprawdź swoją skrzynkę email, aby zresetować hasło",
      })
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać emaila z resetem hasła",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zmiana hasła</CardTitle>
          <CardDescription>Zaktualizuj swoje hasło, aby zwiększyć bezpieczeństwo konta</CardDescription>
        </CardHeader>
        <CardContent>
          {isResetEmailSent ? (
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                Email z linkiem do zmiany hasła został wysłany na adres {user.email}. Sprawdź swoją skrzynkę odbiorczą.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Kliknij przycisk poniżej, aby otrzymać email z linkiem do zmiany hasła.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleResetPassword} disabled={isChangingPassword || isResetEmailSent}>
            {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isResetEmailSent ? "Email wysłany" : "Zmień hasło"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuń konto</CardTitle>
          <CardDescription>Usuń swoje konto i wszystkie powiązane dane</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-800 text-sm">
              Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane, w tym historia zamówień i dane osobowe, zostaną
              trwale usunięte.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Usuń konto</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć swoje konto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta akcja jest nieodwracalna. Spowoduje to trwałe usunięcie Twojego konta i wszystkich powiązanych
                  danych.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Usuń konto</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
