"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/actions/order-actions"
import { toast } from "@/components/ui/use-toast"
import type { Order } from "@/actions/order-actions"

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

export function AdminOrderDetail({ order }: { order: Order }) {
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateOrderStatus(order.id, newStatus)
      if (result.success) {
        setCurrentStatus(newStatus)
        toast({
          title: "Status updated",
          description: `Order status changed to ${newStatus}`,
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
      setIsUpdating(false)
    }
  }

  // Calculate order summary
  const subtotal = order.order_items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  const shipping = 15 // Assuming flat shipping rate
  const total = order.total || subtotal + shipping

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>
            Order #{order.id.slice(0, 8)} • {format(new Date(order.created_at), "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Select value={currentStatus} disabled={isUpdating} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    <Badge className={`${getStatusBadgeColor(currentStatus)} font-normal`}>{currentStatus}</Badge>
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
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Status</span>
              <Badge className={getPaymentStatusBadgeColor(order.payment_status)}>{order.payment_status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Method</span>
              <span className="text-sm">{order.payment_intent ? "Online Payment" : "Cash on Delivery"}</span>
            </div>
            {order.payment_intent && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment ID</span>
                <span className="text-sm font-mono">{order.payment_intent}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Date</span>
              <span className="text-sm">{format(new Date(order.created_at), "PPP HH:mm:ss")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Shipping and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Contact Information</h4>
              <p className="text-sm">
                {order.shipping_address?.firstName} {order.shipping_address?.lastName}
              </p>
              <p className="text-sm">{order.shipping_address?.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
              <p className="text-sm">{order.shipping_address?.address}</p>
              <p className="text-sm">
                {order.shipping_address?.postalCode} {order.shipping_address?.city}
              </p>
              <p className="text-sm">{order.shipping_address?.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products purchased in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product?.name || `Product #${item.product_id}`}</TableCell>
                  <TableCell>
                    {item.size && <span className="mr-2">Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Order Summary */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          {currentStatus === "pending" && (
            <Button onClick={() => handleStatusChange("processing")} disabled={isUpdating}>
              Process Order
            </Button>
          )}
          {currentStatus === "processing" && (
            <Button onClick={() => handleStatusChange("shipped")} disabled={isUpdating}>
              Mark as Shipped
            </Button>
          )}
          {currentStatus === "shipped" && (
            <Button onClick={() => handleStatusChange("delivered")} disabled={isUpdating}>
              Mark as Delivered
            </Button>
          )}
          {currentStatus !== "cancelled" && (
            <Button variant="destructive" onClick={() => handleStatusChange("cancelled")} disabled={isUpdating}>
              Cancel Order
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            Print Order
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
