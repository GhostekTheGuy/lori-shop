import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCollections } from "@/actions/collection-actions"
import { AdminCollectionList } from "@/components/admin/admin-collection-list"

export default async function AdminCollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Link href="/admin/collections/add">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Collection
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading collections...</div>}>
        <AdminCollectionList collections={collections} />
      </Suspense>
    </div>
  )
}
