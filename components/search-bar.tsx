"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    router.push(`/products?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for jerseys, teams, or players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" size="lg" className="px-8">
        Search
      </Button>
    </form>
  )
}
