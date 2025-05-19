import { getSupabase } from "@/lib/supabase"

export default async function AdminFixPage() {
  let message = ""
  let success = false
  let error = null
  let userData = null

  try {
    const supabase = getSupabase()

    // Pobierz sesję
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      error = `Błąd podczas pobierania sesji: ${sessionError.message}`
    } else if (!sessionData.session) {
      error = "Brak aktywnej sesji. Zaloguj się, aby kontynuować."
    } else {
      const userEmail = sessionData.session.user.email
      const userId = sessionData.session.user.id

      // Pobierz dane użytkownika
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 = not found
        error = `Błąd podczas pobierania danych użytkownika: ${userError.message}`
      } else {
        // Aktualizuj lub dodaj użytkownika z uprawnieniami administratora
        const { data, error: upsertError } = await supabase.from("users").upsert(
          {
            id: userId,
            email: userEmail,
            is_admin: true,
            // Dodaj inne pola, jeśli są wymagane
            first_name: existingUser?.first_name || "Admin",
            last_name: existingUser?.last_name || "User",
          },
          { onConflict: "id", returning: "representation" },
        )

        if (upsertError) {
          error = `Błąd podczas aktualizacji uprawnień: ${upsertError.message}`
        } else {
          success = true
          userData = data[0]
          message = existingUser
            ? "Uprawnienia administratora zostały zaktualizowane"
            : "Konto administratora zostało utworzone"
        }
      }
    }
  } catch (e) {
    error = `Nieoczekiwany błąd: ${e instanceof Error ? e.message : String(e)}`
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Naprawa uprawnień administratora</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Błąd</p>
          <p>{error}</p>
        </div>
      ) : success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Sukces</p>
          <p>{message}</p>
        </div>
      ) : (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Przetwarzanie</p>
          <p>Trwa sprawdzanie i naprawianie uprawnień administratora...</p>
        </div>
      )}

      {userData && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Dane użytkownika</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <a href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Przejdź do panelu administratora
        </a>
        <a href="/admin-debug" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
          Diagnostyka
        </a>
        <a href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
          Powrót do strony głównej
        </a>
      </div>
    </div>
  )
}
