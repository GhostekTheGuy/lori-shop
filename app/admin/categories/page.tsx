import { getSupabase } from "@/lib/supabase"
import Link from "next/link"
import { AdminCategoryList } from "@/components/admin/admin-category-list"

export default async function CategoriesPage() {
  const supabase = getSupabase()

  // Pobierz wszystkie kategorie z bazy danych
  const { data: categories, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/add"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Add Category
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">Error loading categories: {error.message}</p>
        </div>
      ) : (
        <AdminCategoryList categories={categories || []} />
      )}
    </div>
  )
}
