"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any jerseys to your cart yet.</p>
            <Button asChild size="lg">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.id}-${item.selectedSize}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Image
                        src={item.images[0] || "/placeholder.png"}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                      {item.isOnSale && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">Sale</Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-gray-600 mb-2">{item.team}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="outline">Size: {item.selectedSize}</Badge>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-gray-400 line-through text-sm">${item.originalPrice}</span>
                            )}
                            <span className="font-bold text-xl text-blue-600">${item.price}</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id, item.selectedSize!)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.selectedSize!, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium text-lg">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.selectedSize!, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto bg-transparent">
                Clear Cart
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (estimated)</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${(getCartTotal() * 1.08).toFixed(2)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-600">Free shipping on orders over $100</p>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                      Have a promo code?
                      <span className="transition group-open:rotate-180">↓</span>
                    </summary>
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Apply Code
                      </Button>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
