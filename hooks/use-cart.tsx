"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product, CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product & { selectedSize: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string; selectedSize: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; selectedSize: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  addItem: (product: Product & { selectedSize?: string; quantity?: number }) => void
  removeItem: (id: string, selectedSize: string) => void
  updateQuantity: (id: string, selectedSize: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  items: CartItem[]
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, selectedSize: action.payload.selectedSize }],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize),
        ),
      }

    case "UPDATE_QUANTITY":
      if (action.payload.quantity === 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize),
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (product: Product & { selectedSize?: string; quantity?: number }) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        selectedSize: product.selectedSize || "M",
        quantity: product.quantity || 1,
      },
    })
  }

  const removeItem = (id: string, selectedSize: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, selectedSize } })
  }

  const updateQuantity = (id: string, selectedSize: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, selectedSize, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        items: state.items,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
