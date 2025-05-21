import { getSupabase } from "@/lib/supabase"
import { checkAdminAccess } from "@/lib/auth-utils"

export default async function AdminAccessDebugPage() {
  let sessionInfo = "No session"
  let userInfo = "No user"
  let adminCheckResult = "Not checked"
  let databaseCheck = "Not performed"
  let error = null

  try {
    const supabase = getSupabase()

    if (!supabase) {
      error = "Supabase client not initialized"
    } else {
      // Get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        error = `Session error: ${sessionError.message}`
      } else if (!sessionData.session) {
        sessionInfo = "No active session found"
      } else {
        sessionInfo = `Session found, expires: ${new Date(sessionData.session.expires_at! * 1000).toLocaleString()}`
        userInfo = `User: ${sessionData.session.user.email} (ID: ${sessionData.session.user.id})`

        // Check admin status
        const isAdmin = await checkAdminAccess()
        adminCheckResult = isAdmin ? "User is an admin" : "User is not an admin"

        // Direct database check
        const { data, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single()

        if (dbError) {
          databaseCheck = `Database error: ${dbError.message}`
        } else if (!data) {
          databaseCheck = "User not found in database"
        } else {
          databaseCheck = `User found in database: ${JSON.stringify(data)}`
        }
      }
    }
  } catch (e: any) {
    error = `Unexpected error: ${e.message}`
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Access Debug</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Information</h2>
        <pre className="bg-gray-100 p-4 rounded">{sessionInfo}</pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <pre className="bg-gray-100 p-4 rounded">{userInfo}</pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Check Result</h2>
        <pre className="bg-gray-100 p-4 rounded">{adminCheckResult}</pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Database Check</h2>
        <pre className="bg-gray-100 p-4 rounded">{databaseCheck}</pre>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Error</h2>
          <pre className="bg-red-100 p-4 rounded text-red-700">{error}</pre>
        </div>
      )}

      <div className="mt-6">
        <a href="/admin" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Try accessing admin panel
        </a>
      </div>
    </div>
  )
}
