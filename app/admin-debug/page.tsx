import { getSupabase } from "@/lib/supabase"

export default async function AdminDebugPage() {
  let sessionInfo = "Brak sesji"
  let userInfo = "Brak danych użytkownika"
  let adminStatus = "Nieznany"
  let error = null

  try {
    const supabase = getSupabase()

    // Pobierz sesję
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      error = `Błąd podczas pobierania sesji: ${sessionError.message}`
    } else if (!sessionData.session) {
      sessionInfo = "Brak aktywnej sesji"
    } else {
      sessionInfo = `Sesja aktywna, użytkownik: ${sessionData.session.user.email}`

      // Pobierz dane użytkownika
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single()

      if (userError) {
        userInfo = `Błąd podczas pobierania danych użytkownika: ${userError.message}`
      } else if (!userData) {
        userInfo = "Nie znaleziono użytkownika w bazie danych"
      } else {
        userInfo = JSON.stringify(userData, null, 2)
        adminStatus = userData.is_admin ? "Administrator" : "Zwykły użytkownik"
      }
    }
  } catch (e) {
    error = `Nieoczekiwany błąd: ${e instanceof Error ? e.message : String(e)}`
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Diagnostyka panelu administratora</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Błąd</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informacje o sesji</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{sessionInfo}</pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informacje o użytkowniku</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{userInfo}</pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status administratora</h2>
          <p
            className={`text-lg font-medium ${
              adminStatus === "Administrator"
                ? "text-green-600"
                : adminStatus === "Zwykły użytkownik"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {adminStatus}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Rozwiązanie problemu</h2>
          <p className="mb-4">Jeśli masz problem z dostępem do panelu administratora, wykonaj następujące kroki:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Upewnij się, że jesteś zalogowany na konto z uprawnieniami administratora</li>
            <li>
              Sprawdź, czy Twoje konto ma ustawioną flagę <code>is_admin</code> na <code>true</code> w bazie danych
            </li>
            <li>Jeśli używasz konta hubciolandos@gmail.com, upewnij się, że jest ono poprawnie skonfigurowane</li>
            <li>Wyloguj się i zaloguj ponownie, aby odświeżyć sesję</li>
            <li>Wyczyść pamięć podręczną przeglądarki i spróbuj ponownie</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
