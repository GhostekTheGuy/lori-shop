import { getFeaturedCollectionProducts } from "@/actions/collection-actions"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface FeaturedCollectionProps {
  id: string
  name: string
  slug: string
  heroImage: string
}

export default async function FeaturedCollection({ id, name, slug, heroImage }: FeaturedCollectionProps) {
  const products = await getFeaturedCollectionProducts(id, 2)

  return (
    <section className="w-full mb-16">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full bg-cover bg-center overflow-hidden">
        <Image
          src={heroImage || "/placeholder.svg?height=800&width=1200&query=abstract collection background"}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">{name}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/sklep/${slug}`}>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black min-w-[200px]"
                >
                  Przeglądaj produkty <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/kolekcje/${slug}`}>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black min-w-[200px]"
                >
                  Kolekcje <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-gray-100 relative group overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">
                  {product.fit || "REGULAR"}
                </div>
                <Link href={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="mt-1">
                      {product.sale_price ? `${product.sale_price.toFixed(2)} zł` : `${product.price.toFixed(2)} zł`}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <>
              <div className="bg-gray-100 relative group overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR</div>
                <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center">
                  <p className="text-gray-500">No products available</p>
                </div>
              </div>
              <div className="bg-gray-100 relative group overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR</div>
                <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center">
                  <p className="text-gray-500">No products available</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Link href={`/kolekcje/${slug}`}>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              Zobacz wszystkie produkty
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
