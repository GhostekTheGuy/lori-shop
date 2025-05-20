"use server"

import { getSupabase } from "@/lib/supabase"

export interface DashboardStats {
  revenue: {
    current: number
    previous: number
    percentChange: number
  }
  orders: {
    current: number
    previous: number
    percentChange: number
  }
  products: {
    current: number
    previous: number
    percentChange: number
  }
  customers: {
    current: number
    previous: number
    percentChange: number
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  // Get current date info
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  // Get previous month info
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  // Get current month revenue
  const { data: currentRevenueData, error: currentRevenueError } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", currentMonthStart)
    .lte("created_at", currentMonthEnd)
    .eq("payment_status", "paid")

  if (currentRevenueError) {
    console.error("Error fetching current revenue:", currentRevenueError)
  }

  // Get previous month revenue
  const { data: previousRevenueData, error: previousRevenueError } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", previousMonthStart)
    .lte("created_at", previousMonthEnd)
    .eq("payment_status", "paid")

  if (previousRevenueError) {
    console.error("Error fetching previous revenue:", previousRevenueError)
  }

  // Calculate revenue
  const currentRevenue = currentRevenueData?.reduce((sum, order) => sum + order.total, 0) || 0
  const previousRevenue = previousRevenueData?.reduce((sum, order) => sum + order.total, 0) || 0
  const revenuePercentChange =
    previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100

  // Get current month orders count
  const { count: currentOrdersCount, error: currentOrdersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", currentMonthStart)
    .lte("created_at", currentMonthEnd)

  if (currentOrdersError) {
    console.error("Error fetching current orders:", currentOrdersError)
  }

  // Get previous month orders count
  const { count: previousOrdersCount, error: previousOrdersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", previousMonthStart)
    .lte("created_at", previousMonthEnd)

  if (previousOrdersError) {
    console.error("Error fetching previous orders:", previousOrdersError)
  }

  // Calculate orders percent change
  const ordersPercentChange =
    previousOrdersCount === 0 ? 100 : ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100

  // Get current month products count
  const { count: currentProductsCount, error: currentProductsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gte("created_at", currentMonthStart)
    .lte("created_at", currentMonthEnd)

  if (currentProductsError) {
    console.error("Error fetching current products:", currentProductsError)
  }

  // Get total products count
  const { count: totalProductsCount, error: totalProductsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  if (totalProductsError) {
    console.error("Error fetching total products:", totalProductsError)
  }

  // Get previous month products count
  const { count: previousProductsCount, error: previousProductsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gte("created_at", previousMonthStart)
    .lte("created_at", previousMonthEnd)

  if (previousProductsError) {
    console.error("Error fetching previous products:", previousProductsError)
  }

  // Calculate products percent change
  const productsPercentChange =
    previousProductsCount === 0 ? 100 : ((currentProductsCount - previousProductsCount) / previousProductsCount) * 100

  // Default customer values
  let currentCustomersCount = 0
  let totalCustomersCount = 0
  let previousCustomersCount = 0
  let customersPercentChange = 0

  // Try to get customer data from orders table as a fallback
  try {
    // First check if we can get customer data from orders
    const { data: uniqueCustomers, error: uniqueCustomersError } = await supabase
      .from("orders")
      .select("user_id")
      .is("user_id", "not.null")
      .order("user_id")

    if (!uniqueCustomersError && uniqueCustomers) {
      // Get unique customer IDs
      const uniqueCustomerIds = [...new Set(uniqueCustomers.map((order) => order.user_id))]
      totalCustomersCount = uniqueCustomerIds.length

      // Estimate current month customers (this is just an approximation)
      const { count: currentMonthOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", currentMonthStart)
        .lte("created_at", currentMonthEnd)

      // Estimate previous month customers
      const { count: previousMonthOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousMonthStart)
        .lte("created_at", previousMonthEnd)

      // Set approximate values based on order counts
      currentCustomersCount = Math.min(totalCustomersCount, currentMonthOrders || 0)
      previousCustomersCount = Math.min(totalCustomersCount, previousMonthOrders || 0)

      // Calculate percent change
      customersPercentChange =
        previousCustomersCount === 0
          ? 0
          : ((currentCustomersCount - previousCustomersCount) / previousCustomersCount) * 100
    }
  } catch (error) {
    console.error("Error getting customer data from orders:", error)
    // Keep default values
  }

  return {
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
      percentChange: Number.parseFloat(revenuePercentChange.toFixed(1)) || 0,
    },
    orders: {
      current: currentOrdersCount || 0,
      previous: previousOrdersCount || 0,
      percentChange: Number.parseFloat(ordersPercentChange.toFixed(1)) || 0,
    },
    products: {
      current: totalProductsCount || 0,
      previous: totalProductsCount - currentProductsCount || 0,
      percentChange: Number.parseFloat(productsPercentChange.toFixed(1)) || 0,
    },
    customers: {
      current: totalCustomersCount || 0,
      previous: previousCustomersCount || 0,
      percentChange: Number.parseFloat(customersPercentChange.toFixed(1)) || 0,
    },
  }
}
