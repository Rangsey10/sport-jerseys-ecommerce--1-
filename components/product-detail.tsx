"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Share2, Minus, Plus, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    // Simulate API call
    const foundProduct = mockProducts.find((p) => p.id === productId)
    setProduct(foundProduct || null)
    if (foundProduct && foundProduct.sizes && foundProduct.sizes.length > 0) {
      setSelectedSize(foundProduct.sizes[0])
    }
  }, [productId])

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addItem({ ...product, selectedSize, quantity })
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={product.images[selectedImage] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isOnSale && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">-{discountPercentage}% OFF</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <Image
                src={image || "/placeholder.png"}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{product.category}</Badge>
            <Badge variant="outline">{product.team}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-6">
            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-3xl text-gray-400 line-through">${product.originalPrice}</span>
            )}
            <span className="text-4xl font-bold text-blue-600">${product.price}</span>
            {product.isOnSale && (
              <Badge variant="destructive" className="text-lg px-3 py-1">
                Save ${(product.originalPrice! - product.price).toFixed(2)}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3 text-lg">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes?.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Quantity</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium text-lg">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleAddToCart} className="flex-1 h-12 text-lg" size="lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent" onClick={handleWishlist}>
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <p className="font-medium mb-1">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <p className="font-medium mb-1">Authentic</p>
                <p className="text-sm text-gray-600">100% genuine products</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                <p className="font-medium mb-1">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Status */}
        {product.stock_quantity !== undefined && (
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-medium">
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
