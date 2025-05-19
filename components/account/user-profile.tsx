"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/actions/user-actions"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")

  // Load user profile data from database when editing starts
  const handleEditClick = async () => {
    setIsEditing(true)
    try {
      setIsLoading(true)
      // Here you would fetch the user's profile data from your database
      // For now, we'll just use placeholder data
      setDisplayName(user.user_metadata?.name || "")
      setPhone(user.user_metadata?.phone || "")
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych profilu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await updateUserProfile(user.id, {
        name: displayName,
        phone: phone,
      })
      toast({
        title: "Sukces",
        description: "Profil został zaktualizowany",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil użytkownika</CardTitle>
        <CardDescription>Zarządzaj swoimi danymi osobowymi</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-sm text-gray-500">Email nie może być zmieniony</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Imię i nazwisko</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Wprowadź imię i nazwisko"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Wprowadź numer telefonu"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Imię i nazwisko</h3>
              <p>{user.user_metadata?.name || "Nie podano"}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Telefon</h3>
              <p>{user.user_metadata?.phone || "Nie podano"}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Anuluj
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Zapisz zmiany
            </Button>
          </>
        ) : (
          <Button onClick={handleEditClick}>Edytuj profil</Button>
        )}
      </CardFooter>
    </Card>
  )
}
