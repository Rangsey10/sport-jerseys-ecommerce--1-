"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, ArrowLeft, CheckCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { orderService } from "@/lib/order-service"
import Image from "next/image"

export function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    sameAsShipping: false,
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validatePayment = () => {
    const cardRegex = /^\d{16}$/ // simple 16-digit check
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/ // MM/YY
    const cvvRegex = /^\d{3,4}$/ // 3 or 4 digits

    if (!cardRegex.test(formData.cardNumber.replace(/\s+/g, ""))) {
      toast({ title: "Invalid Card Number", description: "Card number must be 16 digits." })
      return false
    }
    if (!expiryRegex.test(formData.expiry)) {
      toast({ title: "Invalid Expiry Date", description: "Format must be MM/YY." })
      return false
    }
    if (!cvvRegex.test(formData.cvv)) {
      toast({ title: "Invalid CVV", description: "CVV must be 3 or 4 digits." })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    if (!validatePayment()) {
      setIsProcessing(false)
      return
    }

    try {
      // Create shipping address object
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      }

      // Create order in database
      const result = await orderService.createOrder(items, shippingAddress)

      if (result.success && result.orderId) {
        toast({
          title: "Order placed successfully!",
          description: `Order #${result.orderId?.slice(0, 8)} has been created. Thank you for your purchase!`,
        })
        clearCart()
        
        // Redirect to order confirmation page instead of orders list
        router.push(`/order-confirmation?orderId=${result.orderId}`)
      } else {
        // Log error for debugging
        if (result.error) {
          console.warn('Order creation failed:', result.error)
        }
        
        toast({
          title: "Order failed",
          description: result.error || "There was an error processing your order. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      // Log error for debugging
      console.warn('Checkout error:', error)
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Button asChild>
            <a href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </a>
          </Button>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                        <SelectItem value="il">Illinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="tel"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        type="tel"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} required />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, sameAsShipping: !!checked }))
                      }
                    />
                    <Label htmlFor="sameAsShipping" className="text-sm">
                      Billing address same as shipping
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      3
                    </span>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={item.images[0] || "/placeholder.svg?height=60&width=60&query=sport+jersey"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                          <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${(getCartTotal() * 1.08).toFixed(2)}</span>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    <Lock className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-600">Your payment information is secure and encrypted</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <CheckCircle className="h-3 w-3" />
                      <span>SSL Secured</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
