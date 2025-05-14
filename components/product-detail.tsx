"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, ShoppingBag, HelpCircle, Instagram, Facebook, ArrowRight, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { SizeChartModal } from "@/components/size-chart-modal"
import type { Product } from "@/actions/product-actions"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      alert("Proszę wybrać rozmiar")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0] || "/placeholder.svg",
      quantity: quantity,
      size: selectedSize,
    })
  }

  // Calculate discount percentage if there's a sale price
  const discountPercentage = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  return (
    <>
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-6">
          <Link href="/" className="text-sm border border-gray-300 px-4 py-2 inline-block hover:bg-gray-50">
            Wróć na stronę główną Lori Blank ™
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">{product.category}</p>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-medium">
                  {product.sale_price ? product.sale_price.toFixed(2) : product.price.toFixed(2)} zł
                </span>
                {product.sale_price && (
                  <>
                    <span className="text-gray-500 line-through text-sm">{product.price.toFixed(2)} zł</span>
                    <span className="text-red-500 text-sm">{discountPercentage}% TANIEJ</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Najniższa cena w ciągu ostatnich 30 dni:{" "}
                {product.sale_price ? product.sale_price.toFixed(2) : product.price.toFixed(2)} zł PLN
              </p>
            </div>

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm mb-2">Rozmiar</p>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`border h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && <p className="text-sm text-green-600 mt-2">Wybrano rozmiar: {selectedSize}</p>}
              </div>
            )}

            <div className="mb-6 grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                  <SelectTrigger className="w-full border-gray-300 rounded-none">
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-10"
                  onClick={handleAddToCart}
                  disabled={product.stock_status === "sold-out"}
                >
                  {product.stock_status === "sold-out" ? "Wyprzedane" : "Dodaj do koszyka"}
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {product.description && (
                <div>
                  <h2 className="font-medium mb-2">Opis:</h2>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}
              {product.colors.length > 0 && (
                <div>
                  <h2 className="font-medium mb-2">Dostępne kolory:</h2>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <div key={color} className="text-sm">
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="font-medium mb-2">Krój:</h2>
                <p className="text-sm">Regularny</p>
              </div>
              <button className="flex items-center text-sm hover:underline" onClick={() => setIsSizeChartOpen(true)}>
                <span className="mr-2">Tabela Rozmiarów</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Info Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-base mb-2">Bezpieczne płatności</h3>
              <p className="text-sm">Jako dostawców płatności używamy Przelewy24, Paypal oraz BLIK.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-base mb-2">Prosta realizacja zakupu</h3>
              <p className="text-sm">Nasz checkout jest szybki i prosty w obsłudze.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-base mb-2">Masz pytanie?</h3>
              <p className="text-sm">Skontaktuj się z nami, jeżeli potrzebujesz pomocy przy korzystaniu z serwisu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Logo and Newsletter Section */}
            <div className="mb-10 md:mb-0 md:w-1/3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">LORI</h2>
              </div>
              <p className="text-sm mb-6 max-w-md">
                Subskrybuj aby na bieżąco otrzymywać zapowiedzi, informacje o nowych kolekcjach i przecenach.
              </p>
              <div className="space-y-4">
                <Input type="text" placeholder="Imię" className="border-b border-gray-300 rounded-none px-3" />
                <Input type="email" placeholder="Email" className="border-b border-gray-300 rounded-none px-3" />
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Subskrybuj <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-black hover:text-gray-600">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-black hover:text-gray-600">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Site Map Section */}
            <div className="mb-10 md:mb-0">
              <h3 className="font-semibold text-base mb-4">Mapa strony</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Strona Główna
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Sklep
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Kampanie
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div>
              <h3 className="font-semibold text-base mb-4">Obsługa klienta</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Dostawa i płatność
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Zwroty i reklamacje
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Regulamin
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Polityka prywatności
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
