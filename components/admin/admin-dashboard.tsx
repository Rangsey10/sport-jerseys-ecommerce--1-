"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Package, ShoppingCart, Users, Plus, Edit, Trash2, Eye, ChevronLeft } from "lucide-react"
import { orderService, type Order } from "@/lib/order-service"
import { toast } from "@/hooks/use-toast"
import { AdminHeader } from "./admin-header"
import { AdminQuickActions } from "./admin-quick-actions"
import { AdminTableActions } from "./admin-table-actions"
import { AdminTableFilters } from "./admin-table-filters"

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await orderService.getAllOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    const success = await orderService.updateOrderStatus(orderId, newStatus)
    if (success) {
      toast({
        title: "Success",
        description: "Order status updated successfully"
      })
      loadOrders() // Reload orders
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    }
  }

  const stats = [
    { 
      title: "Total Products", 
      value: "156", 
      icon: Package, 
      change: "+12%" 
    },
    { 
      title: "Total Orders", 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      change: "+8%" 
    },
    { 
      title: "Total Revenue", 
      value: `$${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}`, 
      icon: BarChart3, 
      change: "+23%" 
    },
    { 
      title: "Pending Orders", 
      value: orders.filter(order => order.status === 'pending').length.toString(), 
      icon: Users, 
      change: "+15%" 
    },
  ]

  const quickActionsStats = {
    totalOrders: orders.length,
    lowStockItems: 5, // Mock data
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    revenue: orders.reduce((sum, order) => sum + order.total_amount, 0)
  }

  const orderFilters = {
    status: [
      { label: "Pending", value: "pending", count: orders.filter(o => o.status === 'pending').length },
      { label: "Processing", value: "processing", count: orders.filter(o => o.status === 'processing').length },
      { label: "Shipped", value: "shipped", count: orders.filter(o => o.status === 'shipped').length },
      { label: "Delivered", value: "delivered", count: orders.filter(o => o.status === 'delivered').length },
      { label: "Cancelled", value: "cancelled", count: orders.filter(o => o.status === 'cancelled').length },
    ],
    dateRange: [
      { label: "Today", value: "today" },
      { label: "This Week", value: "week" },
      { label: "This Month", value: "month" },
      { label: "This Year", value: "year" },
    ]
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'shipped':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const products = [
    { id: 1, name: "Lakers Jersey", category: "Basketball", price: "$89.99", stock: 25, status: "Active" },
    { id: 2, name: "Warriors Jersey", category: "Basketball", price: "$94.99", stock: 18, status: "Active" },
    { id: 3, name: "Cowboys Jersey", category: "Football", price: "$79.99", stock: 0, status: "Out of Stock" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Admin Header */}
      <AdminHeader title="Admin Dashboard" onRefresh={loadOrders} />

      {/* Quick Actions */}
      <AdminQuickActions stats={quickActionsStats} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700">Quick Actions:</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toast({
            title: "Bulk Actions",
            description: "Bulk order processing panel would open here"
          })}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Process Orders
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toast({
            title: "Inventory Check",
            description: "Low stock alerts would be shown here"
          })}
        >
          <Package className="h-4 w-4 mr-2" />
          Check Inventory
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toast({
            title: "Generate Reports",
            description: "Sales and analytics reports would be generated"
          })}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="featured">Featured Items</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Advanced Filters */}
              <AdminTableFilters
                searchPlaceholder="Search orders by ID, customer name, or email..."
                filters={orderFilters}
                onSearch={(query) => console.log("Search:", query)}
                onFilter={(filters) => console.log("Filters:", filters)}
                onExport={() => toast({ title: "Export Orders", description: "Orders exported to CSV" })}
                onImport={() => toast({ title: "Import Orders", description: "Order import functionality" })}
              />

              {loading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id?.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.user_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{order.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.order_items?.length || 0} items</TableCell>
                        <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id!, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
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
                          <AdminTableActions
                            itemId={order.id!}
                            itemName={`Order #${order.id?.slice(0, 8)}`}
                            type="order"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Management</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products/import">
                    <Package className="h-4 w-4 mr-2" />
                    Import Products
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Product
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Product Filters */}
              <AdminTableFilters
                searchPlaceholder="Search products by name, category, or SKU..."
                filters={{
                  status: [
                    { label: "Active", value: "active", count: 2 },
                    { label: "Out of Stock", value: "out-of-stock", count: 1 },
                    { label: "Discontinued", value: "discontinued", count: 0 },
                  ],
                  category: [
                    { label: "Basketball", value: "basketball" },
                    { label: "Football", value: "football" },
                    { label: "Baseball", value: "baseball" },
                    { label: "Soccer", value: "soccer" },
                  ]
                }}
                onSearch={(query) => console.log("Search products:", query)}
                onFilter={(filters) => console.log("Product filters:", filters)}
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AdminTableActions
                          itemId={product.id.toString()}
                          itemName={product.name}
                          type="product"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Featured Products Management</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Eye className="h-4 w-4 mr-2" />
                    View Hero Section
                  </Link>
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Featured Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Cristiano Ronaldo Jersey", image: "/CristanoRonaldo.png", position: "Hero Position 1" },
                  { name: "Lionel Messi Jersey", image: "/LionelMessi.png", position: "Hero Position 2" },
                  { name: "Stephen Curry Jersey", image: "/Stephen curry.png", position: "Hero Position 3" },
                  { name: "Jayson Tatum Jersey", image: "/Tatum.png", position: "Hero Position 4" }
                ].map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square relative bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-3">{item.position}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> These are the jerseys displayed in your store's hero section. 
                  <Link href="/" className="underline ml-1">View live hero section</Link> to see how they appear to customers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
                <Button 
                  size="sm"
                  onClick={() => toast({
                    title: "Create Admin User",
                    description: "Admin user creation panel would open here"
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">User Management</h3>
                <p className="text-gray-500 mb-4">
                  View and manage user accounts, roles, and permissions.
                </p>
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => toast({
                      title: "View All Users",
                      description: "User list functionality coming soon"
                    })}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                  <Button 
                    onClick={() => toast({
                      title: "User Analytics",
                      description: "User analytics dashboard coming soon"
                    })}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    User Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
