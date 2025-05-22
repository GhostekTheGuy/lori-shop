import { getHeroSlideById } from "@/actions/hero-slide-actions"
import { AdminHeroSlideForm } from "@/components/admin/admin-hero-slide-form"
import { notFound } from "next/navigation"

interface EditHeroSlidePageProps {
  params: {
    id: string
  }
}

export default async function EditHeroSlidePage({ params }: EditHeroSlidePageProps) {
  const slide = await getHeroSlideById(params.id)

  if (!slide) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Hero Slide</h1>
        <p className="text-gray-500">Update an existing hero slide</p>
      </div>

      <AdminHeroSlideForm slide={slide} isEditing />
    </div>
  )
}
