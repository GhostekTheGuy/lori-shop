"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists with the same ID and size
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id && item.size === newItem.size)

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, newItem]
      }
    })
    openCart()
  }

  const removeItem = (id: string, size?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => {
    setIsOpen(true)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
