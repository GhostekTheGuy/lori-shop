import { AuthDebug } from "@/components/auth-debug"

export default function AdminDebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debugging</h1>
      <AuthDebug />
    </div>
  )
}
