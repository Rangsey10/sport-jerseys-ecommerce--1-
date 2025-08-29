"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Package, ShoppingCart, Users, Eye, CheckCircle, Clock, Truck, XCircle, RefreshCw } from "lucide-react"
import { orderService, type Order } from "@/lib/order-service"
import { toast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [orderStats, setOrderStats] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
    loadOrderStats()
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(() => {
      loadOrders()
      loadOrderStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      console.log('🔄 Admin dashboard - Loading orders...')
      setLoading(true)
      
      const allOrders = await orderService.getAllOrders()
      console.log('📊 Orders loaded:', allOrders?.length || 0)
      
      setOrders(allOrders || [])
    } catch (error) {
      console.error('❌ Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const loadOrderStats = async () => {
    try {
      const stats = await orderService.getOrderStats()
      setOrderStats(stats)
    } catch (error) {
      console.error('❌ Error loading order stats:', error)
    }
  }

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setIsUpdatingStatus(orderId)
      
      const success = await orderService.updateOrderStatus(orderId, newStatus)
      
      if (success) {
        toast({
          title: "Order Updated! ✅",
          description: `Order status changed to ${newStatus}`,
        })
        
        // Refresh data
        await loadOrders()
        await loadOrderStats()
      } else {
        toast({
          title: "Update Failed",
          description: "Could not update order status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the order",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  const dashboardStats = [
    { 
      title: "Total Orders", 
      value: orderStats?.total_orders?.toString() || orders.length.toString(), 
      icon: ShoppingCart, 
      color: "text-blue-600",
      change: "+8%" 
    },
    { 
      title: "Pending Orders", 
      value: orderStats?.pending_orders?.toString() || orders.filter(o => o.status === 'pending').length.toString(), 
      icon: Clock, 
      color: "text-yellow-600",
      change: "⚠️ Needs Action" 
    },
    { 
      title: "Total Revenue", 
      value: `$${orderStats?.total_revenue || orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}`, 
      icon: BarChart3, 
      color: "text-green-600",
      change: "+23%" 
    },
    { 
      title: "Completed", 
      value: orderStats?.completed_orders?.toString() || orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length.toString(), 
      icon: CheckCircle, 
      color: "text-purple-600",
      change: "+15%" 
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage orders and monitor your store performance</p>
            </div>
            <Button onClick={loadOrders} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className={stat.title === "Pending Orders" ? "text-orange-600" : "text-green-600"}>
                    {stat.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Management */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-xl text-gray-900">Order Management</CardTitle>
                  <p className="text-sm text-gray-500">Review and update order status</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders ({orders.length})</SelectItem>
                    <SelectItem value="pending">🟡 Pending ({orders.filter(o => o.status === 'pending').length})</SelectItem>
                    <SelectItem value="processing">🔵 Processing ({orders.filter(o => o.status === 'processing').length})</SelectItem>
                    <SelectItem value="shipped">🟣 Shipped ({orders.filter(o => o.status === 'shipped').length})</SelectItem>
                    <SelectItem value="delivered">🟢 Delivered ({orders.filter(o => o.status === 'delivered').length})</SelectItem>
                    <SelectItem value="cancelled">🔴 Cancelled ({orders.filter(o => o.status === 'cancelled').length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {statusFilter === "all" 
                    ? "No orders have been placed yet. Customers can start shopping to create orders." 
                    : `No ${statusFilter} orders found. Try selecting a different status filter.`}
                </p>
                <div className="space-y-4">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/test-orders">🧪 Test Database & Create Sample Order</Link>
                  </Button>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>💡 <strong>Tips to get orders:</strong></p>
                    <p>• Make sure customers can complete checkout</p>
                    <p>• Check your database connection</p>
                    <p>• Verify user profiles are created properly</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.slice(0, 50).map((order) => (
                      <TableRow key={order.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            #{order.id?.slice(0, 8)}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user_name || 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user_email || 'No email'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeColor(order.status)} flex items-center gap-2 w-fit border`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize font-medium">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          ${order.total_amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select 
                              value={order.status} 
                              onValueChange={(newStatus) => handleOrderStatusUpdate(order.id!, newStatus as Order['status'])}
                              disabled={isUpdatingStatus === order.id}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">🟡 Pending</SelectItem>
                                <SelectItem value="processing">🔵 Processing</SelectItem>
                                <SelectItem value="shipped">🟣 Shipped</SelectItem>
                                <SelectItem value="delivered">🟢 Delivered</SelectItem>
                                <SelectItem value="cancelled">🔴 Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" disabled>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredOrders.length > 50 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing first 50 orders. Total: {filteredOrders.length} orders.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/test-orders">🧪 Test Database Connection</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/inventory">📦 Manage Inventory</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/analytics">📊 View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database Connection</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">✅ Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Processing</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">🟢 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Admin Functions</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">⚡ Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
