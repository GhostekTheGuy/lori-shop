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

  // Get customers data from auth.users instead of users table
  let currentCustomersCount = 0
  let totalCustomersCount = 0
  let previousCustomersCount = 0

  try {
    // Get current month customers count from auth.users
    const { data: currentCustomersData, error: currentCustomersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (currentCustomersError) {
      console.error("Error fetching current customers:", currentCustomersError)
    } else {
      // Filter users created in current month
      currentCustomersCount =
        currentCustomersData?.users.filter((user) => {
          const createdAt = new Date(user.created_at)
          return createdAt >= new Date(currentMonthStart) && createdAt <= new Date(currentMonthEnd)
        }).length || 0

      // Total users count
      totalCustomersCount = currentCustomersData?.users.length || 0

      // Filter users created in previous month
      previousCustomersCount =
        currentCustomersData?.users.filter((user) => {
          const createdAt = new Date(user.created_at)
          return createdAt >= new Date(previousMonthStart) && createdAt <= new Date(previousMonthEnd)
        }).length || 0
    }
  } catch (error) {
    console.error("Error accessing auth.users:", error)

    // Fallback: try to get users from the public users table if it exists
    try {
      // Check if users table exists and has created_at column
      const { data: usersTableExists } = await supabase.from("users").select("id").limit(1)

      if (usersTableExists && usersTableExists.length > 0) {
        // Get current month customers count
        const { count: currentCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", currentMonthStart)
          .lte("created_at", currentMonthEnd)

        currentCustomersCount = currentCount || 0

        // Get total customers count
        const { count: totalCount } = await supabase.from("users").select("*", { count: "exact", head: true })

        totalCustomersCount = totalCount || 0

        // Get previous month customers count
        const { count: previousCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", previousMonthStart)
          .lte("created_at", previousMonthEnd)

        previousCustomersCount = previousCount || 0
      }
    } catch (fallbackError) {
      console.error("Error with fallback users query:", fallbackError)
      // Use default values if both methods fail
    }
  }

  // Calculate customers percent change with fallback to default values
  const customersPercentChange =
    previousCustomersCount === 0
      ? 100
      : ((currentCustomersCount - previousCustomersCount) / previousCustomersCount) * 100

  return {
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
      percentChange: Number.parseFloat(revenuePercentChange.toFixed(1)),
    },
    orders: {
      current: currentOrdersCount || 0,
      previous: previousOrdersCount || 0,
      percentChange: Number.parseFloat(ordersPercentChange.toFixed(1)),
    },
    products: {
      current: totalProductsCount || 0,
      previous: totalProductsCount - currentProductsCount || 0,
      percentChange: Number.parseFloat(productsPercentChange.toFixed(1)),
    },
    customers: {
      current: totalCustomersCount || 0,
      previous: totalCustomersCount - currentCustomersCount || 0,
      percentChange: Number.parseFloat(customersPercentChange.toFixed(1)),
    },
  }
}
