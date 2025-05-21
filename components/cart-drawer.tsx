"use client"

import { useCart, type CartItem } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const router = useRouter()

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      // Small delay to ensure the DOM is updated before starting the animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      // Wait for the animation to complete before removing from DOM
      const timer = setTimeout(() => setIsRendered(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleCheckout = () => {
    closeCart()
    router.push("/checkout")
  }

  if (!isRendered) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${
        isVisible ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={closeCart}
    >
      <div className="absolute inset-0" aria-hidden="true" />

      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Koszyk ({totalItems})</h2>
            <button onClick={closeCart} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close cart">
              <X size={20} />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Twój koszyk jest pusty</p>
                <p className="text-sm text-gray-400 mb-6">Dodaj produkty do koszyka, aby kontynuować</p>
                <Button onClick={closeCart} className="bg-black text-white hover:bg-gray-800">
                  Kontynuuj zakupy
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <CartItemRow
                    key={`${item.id}-${item.size}-${index}`}
                    item={item}
                    onRemove={() => removeItem(item.id, item.size)}
                    onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity, item.size)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Suma częściowa</span>
                <span className="font-medium">{subtotal.toFixed(2)} zł</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Koszty wysyłki i podatki obliczane przy kasie</p>
              <div className="flex flex-col gap-2">
                <Button onClick={closeCart} variant="outline" className="w-full">
                  Kontynuuj zakupy
                </Button>
                <Button onClick={handleCheckout} className="w-full bg-black text-white hover:bg-gray-800">
                  Przejdź do kasy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}) {
  return (
    <li className="flex border-b pb-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3>{item.name}</h3>
          <p className="ml-4">{(item.price * item.quantity).toFixed(2)} zł</p>
        </div>

        {item.size && <p className="mt-1 text-sm text-gray-500">Rozmiar: {item.size}</p>}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border border-gray-300">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 min-w-[2rem] text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button onClick={onRemove} className="text-sm text-gray-500 hover:text-gray-700">
            Usuń
          </button>
        </div>
      </div>
    </li>
  )
}
