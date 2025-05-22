import { getHeroSlides } from "@/actions/hero-slide-actions"
import { AdminHeroSlideList } from "@/components/admin/admin-hero-slide-list"

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlides()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero Slides</h1>
        <p className="text-gray-500">Manage the hero slides that appear on the home page</p>
      </div>

      <AdminHeroSlideList slides={slides} />
    </div>
  )
}
