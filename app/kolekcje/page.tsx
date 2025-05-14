import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import Link from "next/link"
import Image from "next/image"
import { getPublishedCollections } from "@/actions/collection-actions"
import { Loader2 } from "lucide-react"

export default async function CollectionsPage() {
  const collections = await getPublishedCollections()

  return (
    <>
      <Navbar />
      <CartDrawer />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Kolekcje</h1>

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          }
        >
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link key={collection.id} href={`/kolekcje/${collection.slug}`} className="group">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                    <Image
                      src={collection.hero_image || "/placeholder.svg?height=600&width=900&query=abstract collection"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-2">{collection.name}</h2>
                        {collection.description && (
                          <p className="text-sm max-w-md mx-auto opacity-90">
                            {collection.description.length > 100
                              ? `${collection.description.substring(0, 100)}...`
                              : collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Brak dostępnych kolekcji.</p>
            </div>
          )}
        </Suspense>
      </div>
    </>
  )
}
