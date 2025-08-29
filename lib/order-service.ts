'use client'

import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"
import type { Product } from "@/lib/types"

export interface OrderItem {
  id?: string
  order_id?: string
  product_id: string
  product_name: string
  product_image?: string
  size: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id?: string
  user_id?: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address?: any
  created_at?: string
  updated_at?: string
  order_items?: OrderItem[]
  user_email?: string
  user_name?: string
}

export const orderService = {
  // Create a new order from cart items
  async createOrder(cartItems: Product[], shippingAddress?: any): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        return { success: false, error: 'Unable to connect to database' }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      console.log('🔍 Creating order for user:', user.id, user.email)

      // Ensure user profile exists before creating order
      try {
        const { data: profileData, error: profileError } = await supabase
          .rpc('ensure_user_profile', { 
            user_id: user.id, 
            user_email: user.email || 'unknown@email.com' 
          })

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          return { success: false, error: 'Failed to create user profile' }
        }

        console.log('✅ User profile ensured for:', user.id)
      } catch (profileError) {
        console.error('❌ Profile check error:', profileError)
        // Try to create profile manually
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email || 'unknown@email.com',
              full_name: user.email || 'Unknown User'
            })
        } catch (manualProfileError) {
          console.error('❌ Manual profile creation failed:', manualProfileError)
          return { success: false, error: 'Failed to create user profile' }
        }
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      console.log('💰 Creating order with total amount:', totalAmount)

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: shippingAddress
        })
        .select('id')
        .single()

      if (orderError || !order) {
        console.error('❌ Order creation error:', orderError)
        return { success: false, error: orderError?.message || 'Failed to create order' }
      }

      console.log('✅ Order created with ID:', order.id)

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.images[0],
        size: item.selectedSize || 'M',
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('❌ Order items error:', itemsError)
        return { success: false, error: itemsError.message }
      }

      console.log('✅ Order items created successfully')

      return { success: true, orderId: order.id }
    } catch (error) {
      console.error('❌ Unexpected error in createOrder:', error)
      return { success: false, error: 'Unexpected error occurred' }
    }
  },

  // Get all orders for admin
  async getAllOrders(): Promise<Order[]> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      console.log('🔍 Fetching all orders for admin...')
      
      // Check if current user is admin first
      const { data: isAdmin, error: adminCheckError } = await supabase
        .rpc('is_current_user_admin')

      if (adminCheckError) {
        console.error('❌ Admin check error:', adminCheckError)
        return []
      }

      if (!isAdmin) {
        console.log('❌ User is not admin, cannot fetch all orders')
        return []
      }

      // Use the admin function to get all orders (bypasses RLS)
      const { data: orders, error } = await supabase
        .rpc('get_all_orders_admin')

      if (error) {
        console.error('❌ Error fetching orders:', error)
        return []
      }

      if (!orders || orders.length === 0) {
        console.log('📭 No orders found in database')
        return []
      }

      console.log(`✅ Found ${orders.length} orders in database`)

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order: any) => {
          try {
            const { data: orderItems } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id)

            return {
              ...order,
              order_items: orderItems || [],
              user_email: order.user_email || 'Unknown',
              user_name: order.user_full_name || 'Unknown User'
            }
          } catch (itemsError) {
            console.warn('Could not fetch items for order:', order.id)
            return {
              ...order,
              order_items: [],
              user_email: order.user_email || 'Unknown',
              user_name: order.user_full_name || 'Unknown User'
            }
          }
        })
      )

      console.log(`✅ Successfully loaded ${ordersWithItems.length} orders with items`)
      return ordersWithItems || []
    } catch (error) {
      console.error('❌ Error in getAllOrders:', error)
      return []
    }
  },

  // Get orders for a specific user
  async getUserOrders(): Promise<Order[]> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        return []
      }
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user orders:', error)
        return []
      }

      return orders || []
    } catch (error) {
      console.error('Error in getUserOrders:', error)
      return []
    }
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        console.error('❌ No Supabase client available')
        return false
      }

      console.log('🔄 Updating order status:', { orderId, status })
      
      const { data, error } = await supabase
        .rpc('update_order_status', { 
          order_id: orderId, 
          new_status: status 
        })

      if (error) {
        console.error('❌ Error updating order status:', error)
        return false
      }

      console.log('✅ Order status updated successfully')
      return true
    } catch (error) {
      console.error('❌ Error in updateOrderStatus:', error)
      return false
    }
  },

  // Get order statistics for admin dashboard
  async getOrderStats(): Promise<any> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        console.error('❌ No Supabase client available')
        return null
      }

      const { data, error } = await supabase
        .rpc('get_order_stats')

      if (error) {
        console.error('❌ Error fetching order stats:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('❌ Error in getOrderStats:', error)
      return null
    }
  },

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        return false
      }

      const { data, error } = await supabase
        .rpc('is_current_user_admin')

      if (error) {
        console.error('❌ Error checking admin status:', error)
        return false
      }

      return data || false
    } catch (error) {
      console.error('❌ Error in isCurrentUserAdmin:', error)
      return false
    }
  }
}
