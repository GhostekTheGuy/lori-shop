import { getSupabase } from "@/lib/supabase"

export default async function AdminDebugPage() {
  let sessionInfo = "Brak sesji"
  let userInfo = "Brak danych użytkownika"
  let adminStatus = "Nieznany"
  let error = null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Nie ustawiono"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Ustawiono" : "Nie ustawiono"

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

        // Spróbuj utworzyć użytkownika
        const { error: insertError } = await supabase.from("users").insert({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          is_admin: true,
        })

        if (insertError) {
          userInfo += `. Błąd podczas tworzenia użytkownika: ${insertError.message}`
        } else {
          userInfo += ". Utworzono nowego użytkownika z uprawnieniami administratora."
        }
      } else {
        userInfo = JSON.stringify(userData, null, 2)
        adminStatus = userData.is_admin ? "Administrator" : "Zwykły użytkownik"

        // Jeśli użytkownik nie jest administratorem, nadaj mu uprawnienia
        if (!userData.is_admin) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ is_admin: true })
            .eq("id", sessionData.session.user.id)

          if (updateError) {
            userInfo += `. Błąd podczas nadawania uprawnień: ${updateError.message}`
          } else {
            userInfo += ". Nadano uprawnienia administratora."
            adminStatus = "Administrator (po aktualizacji)"
          }
        }
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
          <h2 className="text-xl font-semibold mb-4">Zmienne środowiskowe</h2>
          <p>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl}
          </p>
          <p>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey}
          </p>
        </div>

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
              adminStatus === "Administrator" || adminStatus === "Administrator (po aktualizacji)"
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
            <li>Upewnij się, że jesteś zalogowany (powyżej powinny być informacje o sesji)</li>
            <li>
              Sprawdź, czy Twoje konto ma ustawioną flagę <code>is_admin</code> na <code>true</code> w bazie danych
            </li>
            <li>Jeśli nie, ta strona powinna automatycznie nadać Ci uprawnienia administratora</li>
            <li>
              Po sprawdzeniu powyższych informacji, spróbuj ponownie przejść do{" "}
              <a href="/admin" className="text-blue-600 hover:underline">
                panelu administratora
              </a>
            </li>
            <li>Jeśli nadal masz problemy, wyloguj się i zaloguj ponownie</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <a href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Przejdź do panelu administratora
        </a>
        <a href="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
          Zaloguj się ponownie
        </a>
        <a href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
          Powrót do strony głównej
        </a>
      </div>
    </div>
  )
}
