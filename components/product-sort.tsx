"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "default") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select defaultValue="default" onValueChange={handleSortChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="name">Name: A to Z</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
        <SelectItem value="newest">Newest First</SelectItem>
      </SelectContent>
    </Select>
  )
}
