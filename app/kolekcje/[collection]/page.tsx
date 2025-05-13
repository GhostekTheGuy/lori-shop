import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import Link from "next/link"
import Image from "next/image"

// Define the collection data type
type CollectionData = {
  title: string
  description: string
  heroImage: string
  products: Array<{
    id: string
    name: string
    salePrice: string
    originalPrice: string
    image: string
    tag?: string
  }>
}

// Map of collection slugs to their display data
const collectionData: Record<string, CollectionData> = {
  "fils-de-lesthetique": {
    title: "Fils de L'esthétique",
    description: "Rooted in design, refined through sewing craft, faultless in form.",
    heroImage: "/fashion-model-black-outfit.png",
    products: Array(8)
      .fill(null)
      .map((_, i) => ({
        id: `fils-${i + 1}`,
        name: `${i % 2 === 0 ? "Cream" : "Light Gray"} Cotton T-shirt`,
        salePrice: "95,20 zł",
        originalPrice: "119,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  "earth-day": {
    title: "Earth Day",
    description: "Kolekcja inspirowana naturą i troską o środowisko.",
    heroImage: "/placeholder.svg?key=chfzu",
    products: Array(6)
      .fill(null)
      .map((_, i) => ({
        id: `earth-${i + 1}`,
        name: `${i % 2 === 0 ? "Organic" : "Eco"} Cotton T-shirt`,
        salePrice: "99,20 zł",
        originalPrice: "124,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
  "pass-me-the-love": {
    title: "Pass me the Love",
    description: "Kolekcja pełna pozytywnych emocji i miłości.",
    heroImage: "/placeholder.svg?key=pia9f",
    products: Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `love-${i + 1}`,
        name: `${i % 2 === 0 ? "Love" : "Heart"} Cotton T-shirt`,
        salePrice: "89,20 zł",
        originalPrice: "111,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  "lart-du-lori": {
    title: "L'art du Lori",
    description: "Artystyczna kolekcja inspirowana sztuką współczesną.",
    heroImage: "/placeholder.svg?key=pia9f",
    products: Array(7)
      .fill(null)
      .map((_, i) => ({
        id: `lart-${i + 1}`,
        name: `${i % 2 === 0 ? "Art" : "Canvas"} Cotton T-shirt`,
        salePrice: "109,20 zł",
        originalPrice: "136,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
  "metal-tag": {
    title: "Metal Tag",
    description: "Kolekcja z charakterystycznymi metalowymi detalami.",
    heroImage: "/placeholder.svg?key=bdgza",
    products: Array(6)
      .fill(null)
      .map((_, i) => ({
        id: `metal-${i + 1}`,
        name: `${i % 2 === 0 ? "Metal" : "Tag"} Cotton T-shirt`,
        salePrice: "119,20 zł",
        originalPrice: "149,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 3 === 0 ? "SALE" : undefined,
      })),
  },
  "summer-shades": {
    title: "Summer Shades",
    description: "Letnia kolekcja w jasnych, pastelowych kolorach.",
    heroImage: "/placeholder.svg?key=tf16v",
    products: Array(8)
      .fill(null)
      .map((_, i) => ({
        id: `summer-${i + 1}`,
        name: `${i % 2 === 0 ? "Summer" : "Shade"} Cotton T-shirt`,
        salePrice: "89,20 zł",
        originalPrice: "111,00 zł",
        image: i % 2 === 0 ? "/images/product-1.png" : "/images/product-2.png",
        tag: i % 4 === 0 ? "SALE" : undefined,
      })),
  },
}

export default function CollectionPage({ params }: { params: { collection: string } }) {
  const { collection } = params
  const data = collectionData[collection] || {
    title: "Kolekcja",
    description: "Produkty z tej kolekcji",
    heroImage: "/placeholder.svg",
    products: [],
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] bg-gray-100">
        <Image src={data.heroImage || "/placeholder.svg"} alt={data.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">{data.description}</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/sklep" className="hover:text-black hover:underline">
              Sklep
            </Link>
            <span className="mx-2">/</span>
            <Link href="/kolekcje" className="hover:text-black hover:underline">
              Kolekcje
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{data.title}</span>
          </div>
        </div>

        {/* Products grid */}
        <div className="mt-8">
          {data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  salePrice={product.salePrice}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  tag={product.tag}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Brak produktów w tej kolekcji.</p>
              <Link href="/sklep" className="text-black underline">
                Wróć do sklepu
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
