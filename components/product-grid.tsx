"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductDisplay } from "@/components/product-display"
import type { Product } from "@/lib/types"
import { mockProducts } from "@/lib/mock-data"

interface ProductGridProps {
  limit?: number
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function ProductGrid({ limit, searchParams }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filteredProducts = [...mockProducts]

      // Apply filters
      if (searchParams?.category) {
        const categories = Array.isArray(searchParams.category) ? searchParams.category : [searchParams.category]
        filteredProducts = filteredProducts.filter((product) =>
          categories.some((cat) => product.category.toLowerCase().includes(cat.toLowerCase())),
        )
      }

      if (searchParams?.search) {
        const searchTerm = searchParams.search as string
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.team.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (searchParams?.team) {
        const teams = Array.isArray(searchParams.team) ? searchParams.team : [searchParams.team]
        filteredProducts = filteredProducts.filter((product) =>
          teams.some((team) => product.team.toLowerCase().includes(team.toLowerCase())),
        )
      }

      if (searchParams?.price) {
        const priceRanges = Array.isArray(searchParams.price) ? searchParams.price : [searchParams.price]
        filteredProducts = filteredProducts.filter((product) => {
          return priceRanges.some((range) => {
            const [min, max] = range.split("-").map(Number)
            return product.price >= min && product.price <= max
          })
        })
      }

      // Filter for new arrivals (get the most recent products)
      if (searchParams?.newArrivals) {
        // Sort by newest first, then take a portion as "new arrivals"
        const sortedByNewest = [...filteredProducts].reverse()
        // Consider the latest 60% of products as "new arrivals"
        const newArrivalsCount = Math.ceil(sortedByNewest.length * 0.6)
        filteredProducts = sortedByNewest.slice(0, newArrivalsCount)
      }

      // Apply sorting
      if (searchParams?.sort) {
        const sortBy = searchParams.sort as string
        switch (sortBy) {
          case "price-low":
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case "price-high":
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case "name":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
            break
          case "rating":
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
            break
          case "newest":
            filteredProducts.reverse()
            break
        }
      }

      // Apply limit
      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit)
      }

      setProducts(filteredProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [limit, searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit || 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
            <div className="bg-gray-300 h-6 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        searchParams?.featured ? (
          <ProductDisplay key={product.id} product={product} />
        ) : (
          <ProductCard 
            key={product.id} 
            product={product} 
            showNewBadge={!!searchParams?.newArrivals}
          />
        )
      ))}
    </div>
  )
}
