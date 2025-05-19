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

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  size?: string
  color?: string
  product?: {
    id: string
    name: string
    image_url?: string
    slug?: string
  }
}

export interface Order {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  status: string
  payment_status: string
  total: number
  shipping_address: any
  payment_intent?: string
  notes?: string
  order_items?: OrderItem[]
  items_count?: number
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

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = getSupabase()

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(id, name, image_url, slug)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return order as Order
  } catch (error) {
    console.error("Error in getOrderById:", error)
    return null
  }
}

export interface OrdersFilter {
  status?: string
  paymentStatus?: string
  dateFrom?: string
  dateTo?: string
  minTotal?: number
  maxTotal?: number
}

export interface OrdersParams {
  userId: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  filter?: OrdersFilter
}

export async function getUserOrders({
  userId,
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  filter = {},
}: OrdersParams): Promise<{ orders: Order[]; total: number }> {
  try {
    const supabase = getSupabase()
    const offset = (page - 1) * limit

    // Start building the query
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_items:order_items(
          *,
          product:products(id, name, image_url, slug)
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)

    // Apply filters
    if (filter.status) {
      query = query.eq("status", filter.status)
    }

    if (filter.paymentStatus) {
      query = query.eq("payment_status", filter.paymentStatus)
    }

    if (filter.dateFrom) {
      query = query.gte("created_at", filter.dateFrom)
    }

    if (filter.dateTo) {
      query = query.lte("created_at", filter.dateTo)
    }

    if (filter.minTotal !== undefined) {
      query = query.gte("total", filter.minTotal)
    }

    if (filter.maxTotal !== undefined) {
      query = query.lte("total", filter.maxTotal)
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching user orders:", error)
      return { orders: [], total: 0 }
    }

    // Calculate items count for each order
    const ordersWithItemsCount = data.map((order) => ({
      ...order,
      items_count: order.order_items?.length || 0,
    }))

    return {
      orders: ordersWithItemsCount as Order[],
      total: count || 0,
    }
  } catch (error) {
    console.error("Error in getUserOrders:", error)
    return { orders: [], total: 0 }
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
  revalidatePath("/account")

  return { success: true }
}

// Get order statistics for a user
export async function getUserOrderStats(userId: string) {
  try {
    const supabase = getSupabase()

    // Get total orders count
    const { count: totalOrders, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (countError) {
      console.error("Error fetching order count:", countError)
      return null
    }

    // Get total spent
    const { data: totalSpentData, error: totalSpentError } = await supabase
      .from("orders")
      .select("total")
      .eq("user_id", userId)
      .eq("payment_status", "paid")

    if (totalSpentError) {
      console.error("Error fetching total spent:", totalSpentError)
      return null
    }

    const totalSpent = totalSpentData.reduce((sum, order) => sum + order.total, 0)

    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total,
        status,
        payment_status
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3)

    if (recentOrdersError) {
      console.error("Error fetching recent orders:", recentOrdersError)
      return null
    }

    return {
      totalOrders,
      totalSpent,
      recentOrders,
    }
  } catch (error) {
    console.error("Error in getUserOrderStats:", error)
    return null
  }
}
