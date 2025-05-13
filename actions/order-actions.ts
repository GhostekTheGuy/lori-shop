"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"
import { getStripeInstance } from "@/lib/stripe"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/context/cart-context"

// Type for order data
type OrderData = {
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
}

// Create a new order
export async function createOrder(orderData: OrderData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  // Generate a unique order ID
  const orderId = uuidv4()

  // Get Stripe instance
  const stripe = getStripeInstance()
  if (!stripe) {
    return { success: false, error: "Stripe client not initialized" }
  }

  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total * 100), // Stripe uses cents
      currency: "pln",
      metadata: {
        orderId,
        userId: orderData.userId,
      },
    })

    // Insert the order into the database
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: orderData.userId,
      status: "pending",
      total: orderData.total,
      shipping_address: {
        first_name: orderData.shippingAddress.firstName,
        last_name: orderData.shippingAddress.lastName,
        address: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        postal_code: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country,
        phone: orderData.shippingAddress.phone,
      },
      payment_intent: paymentIntent.id,
      payment_status: "pending",
    })

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { success: false, error: orderError.message }
    }

    // Insert order items
    const orderItems = orderData.items.map((item) => ({
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
      return { success: false, error: itemsError.message }
    }

    return {
      success: true,
      orderId,
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error: any) {
    console.error("Error in createOrder:", error)
    return { success: false, error: error.message || "Failed to create order" }
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

// Get order by ID
export async function getOrderById(id: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, users(email, first_name, last_name)")
    .eq("id", id)
    .single()

  if (orderError) {
    console.error("Error fetching order:", orderError)
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, products(*)")
    .eq("order_id", id)

  if (itemsError) {
    console.error("Error fetching order items:", itemsError)
    return { ...order, items: [] }
  }

  return { ...order, items }
}

// Get orders for a specific user
export async function getUserOrders(userId: string) {
  const supabase = getSupabase()
  if (!supabase) {
    console.error("Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
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
