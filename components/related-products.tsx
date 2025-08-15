"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { mockProducts } from "@/lib/mock-data"

interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Simulate API call - get related products
    const currentProduct = mockProducts.find((p) => p.id === productId)
    if (currentProduct) {
      const related = mockProducts
        .filter((p) => p.id !== productId && p.category === currentProduct.category)
        .slice(0, 4)
      setProducts(related)
    }
  }, [productId])

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
