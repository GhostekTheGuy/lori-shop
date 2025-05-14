import { AdminCollectionForm } from "@/components/admin/admin-collection-form"

export default function AddCollectionPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Collection</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <AdminCollectionForm />
      </div>
    </div>
  )
}
