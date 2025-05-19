"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from "@/components/account/user-profile"
import { OrderHistory } from "@/components/account/order-history"
import { AccountSettings } from "@/components/account/account-settings"
import { AccountDashboard } from "@/components/account/account-dashboard"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Loader2 } from "lucide-react"

export function AccountClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Get tab from URL on client-side only
    const searchParams = new URLSearchParams(window.location.search)
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login?redirect=/account")
    }
  }, [user, isLoading, router])

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab && activeTab !== "dashboard") {
      router.push(`/account?tab=${activeTab}`, { scroll: false })
    } else {
      router.push("/account", { scroll: false })
    }
  }, [activeTab, router])

  if (isLoading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Moje konto</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Pulpit</TabsTrigger>
            <TabsTrigger value="orders">Zamówienia</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AccountDashboard userId={user.id} />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil użytkownika</CardTitle>
                <CardDescription>Zarządzaj swoimi danymi osobowymi</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Historia zamówień</CardTitle>
                <CardDescription>Przeglądaj swoje poprzednie zamówienia</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderHistory userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ustawienia konta</CardTitle>
                <CardDescription>Zarządzaj ustawieniami swojego konta</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSettings user={user} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
