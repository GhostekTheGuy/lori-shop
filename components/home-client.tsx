"use client"

import { useState, useEffect } from "react"
import { CreditCard, ShoppingBag, HelpCircle, ChevronUp } from "lucide-react"
import { Footer } from "@/components/footer"

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
      </section>
      <Footer />
    </>
  )
}
