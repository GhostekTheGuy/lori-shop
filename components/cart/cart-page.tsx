"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Calculate shipping cost (free shipping over 200 zł)
  const shippingCost = subtotal > 200 ? 0 : 15

  // Calculate total
  const total = subtotal + shippingCost

  const handleQuantityChange = async (id: string, quantity: number, size?: string) => {
    const itemKey = `${id}-${size || "default"}`
    setIsUpdating(itemKey)

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    updateQuantity(id, quantity, size)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (id: string, size?: string) => {
    const itemKey = `${id}-${size || "default"}`
    setIsUpdating(itemKey)

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    removeItem(id, size)
    setIsUpdating(null)
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-8">Twój koszyk</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="mb-6 flex justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Twój koszyk jest pusty</h2>
            <p className="text-gray-600 mb-8">Wygląda na to, że nie dodałeś jeszcze żadnych produktów do koszyka.</p>
            <Link href="/sklep">
              <Button className="bg-black hover:bg-gray-800">Przejdź do sklepu</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Twój koszyk</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const itemKey = `${item.id}-${item.size || "default"}`
                  const isItemUpdating = isUpdating === itemKey

                  return (
                    <div key={itemKey} className="p-6 flex flex-col sm:flex-row gap-4">
                      <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} zł</p>
                        </div>
                        {item.size && <p className="text-sm text-gray-500 mt-1">Rozmiar: {item.size}</p>}
                        <p className="text-sm text-gray-500 mt-1">{item.price.toFixed(2)} zł / szt.</p>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size)}
                              disabled={isItemUpdating}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              aria-label="Zmniejsz ilość"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size)}
                              disabled={isItemUpdating}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              aria-label="Zwiększ ilość"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            disabled={isItemUpdating}
                            className="text-gray-500 hover:text-red-500 disabled:opacity-50"
                            aria-label="Usuń produkt"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <p className="text-gray-600">Wartość produktów</p>
                  <p className="font-medium">{subtotal.toFixed(2)} zł</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Dostawa</p>
                  <p className="font-medium">{shippingCost === 0 ? "Za darmo" : `${shippingCost.toFixed(2)} zł`}</p>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <p className="font-semibold">Razem</p>
                    <p className="font-semibold">{total.toFixed(2)} zł</p>
                  </div>
                </div>
              </div>

              {shippingCost === 0 ? (
                <div className="bg-green-50 text-green-700 p-3 text-sm rounded-md mb-6">
                  Kwalifikujesz się do darmowej dostawy!
                </div>
              ) : (
                <div className="text-sm text-gray-600 mb-6">
                  Dodaj produkty za {(200 - subtotal).toFixed(2)} zł, aby otrzymać darmową dostawę.
                </div>
              )}

              <Button onClick={() => router.push("/checkout")} className="w-full bg-black hover:bg-gray-800 text-white">
                Przejdź do kasy
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-4">
                <Link href="/sklep" className="text-sm text-gray-600 hover:text-black flex items-center justify-center">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Kontynuuj zakupy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
