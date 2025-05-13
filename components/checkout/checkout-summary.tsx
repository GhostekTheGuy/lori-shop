"use client"

import Image from "next/image"
import type { CartItem } from "@/context/cart-context"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
}

export function CheckoutSummary({ items, subtotal }: CheckoutSummaryProps) {
  // Calculate shipping cost (free shipping over 200 zł)
  const shippingCost = subtotal > 200 ? 0 : 15

  // Calculate total
  const total = subtotal + shippingCost

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="py-4 flex">
            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
              <div className="flex justify-between mt-1">
                <p className="text-sm">
                  {item.quantity} × {item.price.toFixed(2)} zł
                </p>
                <p className="font-medium">{(item.price * item.quantity).toFixed(2)} zł</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">{subtotal.toFixed(2)} zł</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">{shippingCost === 0 ? "Free" : `${shippingCost.toFixed(2)} zł`}</p>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">{total.toFixed(2)} zł</p>
        </div>
      </div>

      {shippingCost === 0 && (
        <div className="mt-4 bg-green-50 text-green-700 p-3 text-sm rounded-md">You qualify for free shipping!</div>
      )}

      {subtotal < 200 && (
        <div className="mt-4 text-sm text-gray-600">
          Add {(200 - subtotal).toFixed(2)} zł more to qualify for free shipping.
        </div>
      )}
    </div>
  )
}
