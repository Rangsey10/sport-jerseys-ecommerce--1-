"use client"

import { useState, useEffect } from "react"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function TestOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to database",
          variant: "destructive",
        })
        return
      }

      console.log("🔍 Checking database tables...")

      // Check orders table
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Orders table error:', ordersError)
      } else {
        console.log('📦 Orders found:', ordersData?.length || 0)
        setOrders(ordersData || [])
      }

      // Check profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')

      if (profilesError) {
        console.error('Profiles table error:', profilesError)
      } else {
        console.log('👥 Profiles found:', profilesData?.length || 0)
        setProfiles(profilesData || [])
      }

      // Check order_items table
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')

      if (itemsError) {
        console.error('Order items table error:', itemsError)
      } else {
        console.log('🛍️ Order items found:', itemsData?.length || 0)
        setOrderItems(itemsData || [])
      }

    } catch (error) {
      console.error('Database check error:', error)
      toast({
        title: "Database Error",
        description: "Error checking database tables",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestOrder = async () => {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to database",
          variant: "destructive",
        })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in first",
          variant: "destructive",
        })
        return
      }

      // Create test order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: 99.99,
          status: 'pending',
          shipping_address: {
            firstName: 'Test',
            lastName: 'User',
            email: user.email,
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          }
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating test order:', orderError)
        toast({
          title: "Order Creation Failed",
          description: orderError.message,
          variant: "destructive",
        })
        return
      }

      // Create test order item
      if (order) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: 'test-product-1',
            product_name: 'Test Jersey',
            product_image: '/placeholder.png',
            size: 'L',
            quantity: 1,
            unit_price: 99.99,
            total_price: 99.99
          })

        if (itemError) {
          console.error('Error creating test order item:', itemError)
        }
      }

      toast({
        title: "Test Order Created! 🎉",
        description: "A test order has been created successfully",
      })

      // Refresh data
      checkDatabase()

    } catch (error) {
      console.error('Error creating test order:', error)
      toast({
        title: "Error",
        description: "Failed to create test order",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Orders Table</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-gray-600">Orders in database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profiles Table</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{profiles.length}</p>
              <p className="text-gray-600">User profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items Table</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{orderItems.length}</p>
              <p className="text-gray-600">Order items</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Button onClick={createTestOrder} className="mr-4">
            Create Test Order
          </Button>
          <Button onClick={checkDatabase} variant="outline">
            Refresh Data
          </Button>
        </div>

        {orders.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Order ID:</strong><br />
                        #{order.id.slice(0, 8)}
                      </div>
                      <div>
                        <strong>User ID:</strong><br />
                        {order.user_id?.slice(0, 8)}...
                      </div>
                      <div>
                        <strong>Amount:</strong><br />
                        ${order.total_amount}
                      </div>
                      <div>
                        <strong>Status:</strong><br />
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Created: {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">🔍 How to Test:</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Click "Create Test Order" to add a sample order</li>
                <li>Go to the admin dashboard to see if orders appear</li>
                <li>Try placing a real order through the checkout process</li>
                <li>Check browser console for any error messages</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold">❌ If you see 0 orders:</h3>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Check that the database tables were created properly</li>
                <li>Verify the checkout process is working</li>
                <li>Look at browser console for error messages</li>
                <li>Make sure you're logged in when placing orders</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
