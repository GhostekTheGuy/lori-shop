"use server"

import { v4 as uuidv4 } from "uuid"
import { getSupabase } from "@/lib/supabase"
import { createPaymentIntent } from "@/lib/stripe"
import type { CartItem } from "@/context/cart-context"
import { revalidatePath } from "next/cache"

interface OrderData {
  userId: string
  items: CartItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
  total: number
  paymentMethod?: "stripe" | "cash_on_delivery"
  isPreviewEnvironment?: boolean
}

export async function createOrder(data: OrderData) {
  try {
    const supabase = getSupabase()
    const orderId = uuidv4()

    // Determine payment status based on payment method
    const paymentStatus = data.paymentMethod === "cash_on_delivery" ? "cash_on_delivery" : "pending"

    // Create order in database - without using payment_method column
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: data.userId,
      total: data.total,
      shipping_address: data.shippingAddress,
      payment_status: paymentStatus,
      status: "pending",
      // Removed payment_method field as it doesn't exist in the schema
    })

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { success: false, error: "Failed to create order" }
    }

    // Insert order items
    const orderItems = data.items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return { success: false, error: "Failed to create order items" }
    }

    // If payment method is stripe, create payment intent
    let clientSecret = null
    let paymentIntentId = null

    if (!data.paymentMethod || data.paymentMethod === "stripe") {
      try {
        // For preview environments, limit payment methods to card only to avoid redirect issues
        const paymentMethodTypes = data.isPreviewEnvironment ? ["card"] : ["card", "p24"]

        const paymentIntent = await createPaymentIntent({
          amount: Math.round(data.total * 100), // Convert to cents
          currency: "pln",
          metadata: {
            orderId,
            userId: data.userId,
          },
          payment_method_types: paymentMethodTypes,
        })

        if (!paymentIntent || !paymentIntent.client_secret) {
          throw new Error("Failed to create payment intent")
        }

        clientSecret = paymentIntent.client_secret
        paymentIntentId = paymentIntent.id

        // Update order with payment intent ID
        await supabase.from("orders").update({ payment_intent: paymentIntentId }).eq("id", orderId)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        return { success: false, error: "Failed to create payment intent" }
      }
    }

    revalidatePath("/checkout")
    revalidatePath("/checkout/success")

    return {
      success: true,
      orderId,
      clientSecret,
      paymentMethod: data.paymentMethod || "stripe",
      isPreviewEnvironment: data.isPreviewEnvironment,
    }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Pozostałe funkcje pozostają bez zmian
export async function getOrderById(orderId: string) {
  try {
    const supabase = getSupabase()

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return order
  } catch (error) {
    console.error("Error in getOrderById:", error)
    return null
  }
}

export async function getUserOrders(userId: string) {
  try {
    const supabase = getSupabase()

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user orders:", error)
      return []
    }

    return orders
  } catch (error) {
    console.error("Error in getUserOrders:", error)
    return []
  }
}

// Get all orders for admin
export async function getOrders() {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, users(email, first_name, last_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the orders page
  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${id}`)

  return { success: true }
}
