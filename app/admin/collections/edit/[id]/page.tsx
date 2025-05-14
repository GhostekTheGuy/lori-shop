import { notFound } from "next/navigation"
import { AdminCollectionForm } from "@/components/admin/admin-collection-form"
import { getSupabase } from "@/lib/supabase"

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = getSupabase()

  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  const { data: collection, error } = await supabase.from("collections").select("*").eq("id", id).single()

  if (error || !collection) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Collection: {collection.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <AdminCollectionForm collection={collection} isEdit />
      </div>
    </div>
  )
}
