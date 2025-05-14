import { getProductsByCategory } from "@/actions/product-actions"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default async function FeaturedBlanks() {
  const blanksProducts = await getProductsByCategory("blanks", 2)

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blanksProducts.length > 0 ? (
          blanksProducts.map((product) => (
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
              <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR 320</div>
              <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center">
                <p className="text-gray-500">No products available</p>
              </div>
            </div>
            <div className="bg-gray-100 relative group overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR 320</div>
              <div className="aspect-[4/5] relative overflow-hidden flex items-center justify-center">
                <p className="text-gray-500">No products available</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/sklep/blanks">
          <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
            Zobacz wszystkie produkty
          </Button>
        </Link>
      </div>
    </div>
  )
}
