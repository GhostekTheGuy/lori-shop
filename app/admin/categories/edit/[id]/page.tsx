import { getCategoryById } from "@/actions/category-actions"
import { AdminCategoryForm } from "@/components/admin/admin-category-form"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <AdminCategoryForm category={category} />
    </div>
  )
}
