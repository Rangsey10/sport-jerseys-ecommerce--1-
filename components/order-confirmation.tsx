"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from "lucide-react"
import { orderService, type Order } from "@/lib/order-service"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export function OrderConfirmation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId)
    } else {
      setLoading(false)
    }
  }, [orderId])

  const loadOrderDetails = async (orderIdParam: string) => {
    try {
      const orders = await orderService.getUserOrders()
      const foundOrder = orders.find(o => o.id === orderIdParam)
      setOrder(foundOrder || null)
    } catch (error) {
      console.error('Error loading order:', error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading order details...</div>
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <Button onClick={() => router.push("/products")}>
            <Home className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order #{order.id?.slice(0, 8)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Image
                        src={item.product_image || "/placeholder.png"}
                        alt={item.product_name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.unit_price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Paid:</span>
                <span className="text-green-600">${order.total_amount.toFixed(2)}</span>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                      </p>
                      <p>{order.shipping_address.email}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-600">We'll prepare your order for shipment within 1-2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Shipping Notification</p>
                    <p className="text-sm text-gray-600">You'll receive an email with tracking information once your order ships.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-600">Your order will arrive within 3-5 business days.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => router.push("/orders")} className="flex-1">
              <Package className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
            <Button variant="outline" onClick={() => router.push("/products")} className="flex-1">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions about your order, feel free to contact our support team.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
