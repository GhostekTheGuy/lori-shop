"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserOrders, type Order, type OrdersParams, type OrdersFilter } from "@/actions/order-actions"
import { formatCurrency } from "@/lib/utils"
import { Loader2, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

interface OrderHistoryProps {
  userId: string
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [limit] = useState(5)
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<OrdersFilter>({})

  // Fetch orders with current pagination, sorting and filtering
  const fetchOrders = async () => {
    try {
      setIsLoading(true)

      // Set filter based on active tab
      let statusFilter = {}
      if (activeTab !== "all") {
        statusFilter = { status: activeTab }
      }

      const params: OrdersParams = {
        userId,
        page,
        limit,
        sortBy,
        sortOrder,
        filter: { ...filters, ...statusFilter },
      }

      const { orders: fetchedOrders, total } = await getUserOrders(params)

      setOrders(fetchedOrders)
      setTotalOrders(total)
      setTotalPages(Math.ceil(total / limit))
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Nie udało się załadować historii zamówień")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch orders when parameters change
  useEffect(() => {
    fetchOrders()
  }, [userId, page, limit, sortBy, sortOrder, activeTab, filters])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters, activeTab])

  // Handle filter changes
  const handleFilterChange = (key: keyof OrdersFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setActiveTab("all")
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: pl })
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Oczekujące"
      case "processing":
        return "W trakcie realizacji"
      case "shipped":
        return "Wysłane"
      case "delivered":
        return "Dostarczone"
      case "cancelled":
        return "Anulowane"
      default:
        return status
    }
  }

  // Get payment status label
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Oczekująca"
      case "paid":
        return "Opłacone"
      case "failed":
        return "Nieudana"
      case "refunded":
        return "Zwrócone"
      case "cash_on_delivery":
        return "Płatność przy odbiorze"
      default:
        return status
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      case "cash_on_delivery":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs for quick filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Wszystkie</TabsTrigger>
          <TabsTrigger value="pending">Oczekujące</TabsTrigger>
          <TabsTrigger value="processing">W realizacji</TabsTrigger>
          <TabsTrigger value="shipped">Wysłane</TabsTrigger>
          <TabsTrigger value="delivered">Dostarczone</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Sorting and filtering controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            {totalOrders}{" "}
            {totalOrders === 1
              ? "zamówienie"
              : totalOrders % 10 >= 2 && totalOrders % 10 <= 4 && (totalOrders % 100 < 10 || totalOrders % 100 >= 20)
                ? "zamówienia"
                : "zamówień"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtry
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Wyczyść
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sort-by" className="text-sm">
            Sortuj:
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]" id="sort-by">
              <SelectValue placeholder="Sortuj według" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Data zamówienia</SelectItem>
              <SelectItem value="total">Kwota</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Kolejność" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Malejąco</SelectItem>
              <SelectItem value="asc">Rosnąco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-status">Status płatności</Label>
                <Select
                  value={filters.paymentStatus || ""}
                  onValueChange={(value) => handleFilterChange("paymentStatus", value || undefined)}
                >
                  <SelectTrigger id="payment-status">
                    <SelectValue placeholder="Wszystkie statusy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie statusy</SelectItem>
                    <SelectItem value="pending">Oczekująca</SelectItem>
                    <SelectItem value="paid">Opłacone</SelectItem>
                    <SelectItem value="failed">Nieudana</SelectItem>
                    <SelectItem value="refunded">Zwrócone</SelectItem>
                    <SelectItem value="cash_on_delivery">Za pobraniem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">Data od</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Data do</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-total">Minimalna kwota</Label>
                <Input
                  id="min-total"
                  type="number"
                  placeholder="0.00"
                  value={filters.minTotal || ""}
                  onChange={(e) => handleFilterChange("minTotal", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-total">Maksymalna kwota</Label>
                <Input
                  id="max-total"
                  type="number"
                  placeholder="0.00"
                  value={filters.maxTotal || ""}
                  onChange={(e) => handleFilterChange("maxTotal", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {Object.keys(filters).length > 0 || activeTab !== "all"
            ? "Nie znaleziono zamówień spełniających kryteria"
            : "Nie masz jeszcze żadnych zamówień"}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="border-b bg-gray-50 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="font-medium">Zamówienie #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {order.items_count}{" "}
                      {order.items_count === 1
                        ? "produkt"
                        : order.items_count % 10 >= 2 &&
                            order.items_count % 10 <= 4 &&
                            (order.items_count % 100 < 10 || order.items_count % 100 >= 20)
                          ? "produkty"
                          : "produktów"}
                    </p>

                    {/* Preview of products */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {order.order_items.slice(0, 3).map((item) => (
                          <div key={item.id} className="text-xs text-gray-600">
                            {item.product?.name} ({item.quantity}x)
                          </div>
                        ))}
                        {order.order_items.length > 3 && (
                          <div className="text-xs text-gray-600">+{order.order_items.length - 3} więcej</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                    <div className="text-lg font-medium">{formatCurrency(order.total)}</div>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Szczegóły
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Poprzednia
          </Button>

          <div className="text-sm text-gray-500">
            Strona {page} z {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Następna
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
