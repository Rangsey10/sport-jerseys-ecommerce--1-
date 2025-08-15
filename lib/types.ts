export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  team: string
  sizes: string[]
  isOnSale?: boolean
  rating?: number
  reviewCount?: number
  stock_quantity?: number
  selectedSize?: string
  quantity: number
}

export interface CartItem extends Product {
  selectedSize: string
  quantity: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "customer" | "admin"
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
}
