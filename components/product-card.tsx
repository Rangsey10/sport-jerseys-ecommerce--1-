"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
  showNewBadge?: boolean
}

export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    console.log('Add to cart clicked, user:', user) // Debug log
    
    if (!user) {
      console.log('No user found, redirecting to login') // Debug log
      toast({
        title: "Login required",
        description: "Please log in to add items to your cart.",
      })
      router.push("/auth/login")
      return
    }
    
    console.log('User found, adding to cart') // Debug log
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
    router.push("/cart")
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
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
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.images[currentImageIndex] || "/placeholder.png"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Image indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {showNewBadge && <Badge className="bg-green-500 text-white">NEW</Badge>}
            {product.isOnSale && <Badge className="bg-red-500 text-white">-{discountPercentage}%</Badge>}
            {product.stock_quantity && product.stock_quantity < 10 && (
              <Badge variant="outline" className="bg-white/90">
                Only {product.stock_quantity} left
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white" onClick={handleWishlist}>
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-3">{product.team}</p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
              )}
              <span className="font-bold text-xl text-blue-600">${product.price}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button onClick={handleAddToCart} className="w-full h-12 text-base" size="lg">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
