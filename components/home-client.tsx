"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, ShoppingBag, HelpCircle, Instagram, Facebook, ArrowRight, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomeClient() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 500px
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Featured Collection Section */}
      <section className="w-full">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full bg-cover bg-center overflow-hidden">
          <Image
            src="/images/lori-blanks-header.webp"
            alt="Lori Blanks Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Lori Blanks</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sklep/blanks">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black min-w-[200px]"
                  >
                    Przeglądaj produkty <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/kolekcje/blanks">
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
            <div className="bg-gray-100 relative group overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR 320</div>
              <Link href="/product/blanks-1" className="block">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src="/images/beige-hoodie.webp"
                    alt="Beige Hoodie"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium">Beige Cotton Hoodie</h3>
                  <p className="mt-1">219,00 zł</p>
                </div>
              </Link>
            </div>

            <div className="bg-gray-100 relative group overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-medium text-gray-500 z-10">REGULAR 320</div>
              <Link href="/product/blanks-2" className="block">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src="/images/mauve-hoodie.webp"
                    alt="Mauve Hoodie"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium">Mauve Cotton Hoodie</h3>
                  <p className="mt-1">219,00 zł</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/sklep/blanks">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Zobacz wszystkie produkty
              </Button>
            </Link>
          </div>
        </div>

        {/* Back to top button with scroll animation */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 bg-black text-white p-3 rounded-none shadow-lg hover:bg-gray-800 transition-all duration-300 transform ${
            showScrollTop
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-90 pointer-events-none"
          }`}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </button>

        <footer className="bg-gray-100 py-12">
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
        </footer>

        {/* New Footer Section */}
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
      </section>
    </>
  )
}
