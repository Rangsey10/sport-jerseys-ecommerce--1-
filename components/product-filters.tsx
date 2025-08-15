"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const categories = [
  { id: "football", name: "Football", count: 120 },
  { id: "basketball", name: "Basketball", count: 85 },
  { id: "soccer", name: "Soccer", count: 200 },
  { id: "baseball", name: "Baseball", count: 95 },
  { id: "hockey", name: "Hockey", count: 45 },
]

const teams = [
  { id: "lakers", name: "Lakers", count: 12 },
  { id: "warriors", name: "Warriors", count: 8 },
  { id: "cowboys", name: "Cowboys", count: 15 },
  { id: "patriots", name: "Patriots", count: 10 },
  { id: "yankees", name: "Yankees", count: 18 },
  { id: "dodgers", name: "Dodgers", count: 14 },
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const priceRanges = [
  { label: "Under $50", value: "0-50", count: 45 },
  { label: "$50 - $100", value: "50-100", count: 120 },
  { label: "$100 - $200", value: "100-200", count: 85 },
  { label: "Over $200", value: "200-999", count: 25 },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams)
    const currentValues = params.get(key)?.split(",") || []

    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value)
      }
    } else {
      const index = currentValues.indexOf(value)
      if (index > -1) {
        currentValues.splice(index, 1)
      }
    }

    if (currentValues.length > 0) {
      params.set(key, currentValues.join(","))
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("category")
    params.delete("team")
    params.delete("size")
    params.delete("price")
    router.push(`/products?${params.toString()}`)
  }

  const removeFilter = (key: string, value: string) => {
    updateFilter(key, value, false)
  }

  const activeFilters = []
  const categoryFilters = searchParams.get("category")?.split(",") || []
  const teamFilters = searchParams.get("team")?.split(",") || []
  const sizeFilters = searchParams.get("size")?.split(",") || []
  const priceFilters = searchParams.get("price")?.split(",") || []

  categoryFilters.forEach((filter) => activeFilters.push({ key: "category", value: filter, label: filter }))
  teamFilters.forEach((filter) => activeFilters.push({ key: "team", value: filter, label: filter }))
  sizeFilters.forEach((filter) => activeFilters.push({ key: "size", value: filter, label: filter }))
  priceFilters.forEach((filter) => {
    const range = priceRanges.find((r) => r.value === filter)
    if (range) activeFilters.push({ key: "price", value: filter, label: range.label })
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            {activeFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter.key, filter.value)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          )}

          {/* Category Filter */}
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={categoryFilters.includes(category.id)}
                      onCheckedChange={(checked) => updateFilter("category", category.id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Team Filter */}
          <div>
            <h4 className="font-medium mb-3">Team</h4>
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={teamFilters.includes(team.id)}
                      onCheckedChange={(checked) => updateFilter("team", team.id, checked as boolean)}
                    />
                    <Label htmlFor={`team-${team.id}`} className="text-sm">
                      {team.name}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-500">({team.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size Filter */}
          <div>
            <h4 className="font-medium mb-3">Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={sizeFilters.includes(size)}
                    onCheckedChange={(checked) => updateFilter("size", size, checked as boolean)}
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Filter */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-3">
              {priceRanges.map((range) => (
                <div key={range.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${range.value}`}
                      checked={priceFilters.includes(range.value)}
                      onCheckedChange={(checked) => updateFilter("price", range.value, checked as boolean)}
                    />
                    <Label htmlFor={`price-${range.value}`} className="text-sm">
                      {range.label}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-500">({range.count})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
