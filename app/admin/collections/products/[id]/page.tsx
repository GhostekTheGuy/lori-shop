import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { CollectionProductManager } from "@/components/admin/collection-product-manager"
import { getAllProductsForAdmin } from "@/actions/product-actions"

export default async function ManageCollectionProductsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = getSupabase()

  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  // Get collection details
  const { data: collection, error } = await supabase.from("collections").select("*").eq("id", id).single()

  if (error || !collection) {
    notFound()
  }

  // Get all products for selection
  const allProducts = await getAllProductsForAdmin()

  // Get products already in this collection
  const { data: collectionProducts, error: productsError } = await supabase
    .from("collection_products")
    .select("product_id, display_order")
    .eq("collection_id", id)
    .order("display_order", { ascending: true })

  if (productsError) {
    console.error("Error fetching collection products:", productsError)
  }

  const collectionProductIds = (collectionProducts || []).map((cp) => cp.product_id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products in Collection: {collection.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <CollectionProductManager
          collection={collection}
          allProducts={allProducts}
          collectionProductIds={collectionProductIds}
          collectionProducts={collectionProducts || []}
        />
      </div>
    </div>
  )
}
