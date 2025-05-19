"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/actions/order-actions"
import { toast } from "@/components/ui/use-toast"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount)
}

// Helper function to get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    case "shipped":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "delivered":
      return "bg-green-500 text-white hover:bg-green-500"
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Helper function to get payment status badge color
const getPaymentStatusBadgeColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "cash_on_delivery":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function AdminOrderList({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId)
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        toast({
          title: "Status updated",
          description: `Order #${orderId.slice(0, 8)} status changed to ${newStatus}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  if (!orders.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No orders found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                  #{order.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell>{format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
              <TableCell>{order.users?.email || "Guest"}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  disabled={isUpdating === order.id}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue>
                      <Badge className={`${getStatusBadgeColor(order.status)} font-normal`}>{order.status}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge className={getPaymentStatusBadgeColor(order.payment_status)}>{order.payment_status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
