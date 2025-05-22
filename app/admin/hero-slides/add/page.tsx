import { AdminHeroSlideForm } from "@/components/admin/admin-hero-slide-form"

export default function AddHeroSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Hero Slide</h1>
        <p className="text-gray-500">Create a new hero slide for the home page</p>
      </div>

      <AdminHeroSlideForm />
    </div>
  )
}
