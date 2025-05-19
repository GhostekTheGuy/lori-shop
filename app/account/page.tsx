import { Suspense } from "react"
import { AccountClient } from "@/components/account/account-client"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Moje konto | LORI",
  description: "Zarządzaj swoim kontem i przeglądaj historię zamówień",
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <AccountClient />
    </Suspense>
  )
}
