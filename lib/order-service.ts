'use client'

import { createClient } from "@/lib/supabase/client"
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
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

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
        return { success: false, error: orderError?.message || 'Failed to create order' }
      }

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
        return { success: false, error: itemsError.message }
      }

      return { success: true, orderId: order.id }
    } catch (error) {
      console.error('Order creation error:', error)
      return { success: false, error: 'Unexpected error occurred' }
    }
  },

  // Get all orders for admin
  async getAllOrders(): Promise<Order[]> {
    const supabase = createClient()
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(email, first_name, last_name),
        order_items(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }

    return orders?.map(order => ({
      ...order,
      user_email: order.profiles?.email,
      user_name: `${order.profiles?.first_name} ${order.profiles?.last_name}`.trim()
    })) || []
  },

  // Get orders for a specific user
  async getUserOrders(): Promise<Order[]> {
    const supabase = createClient()
    
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
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    return !error
  }
}
