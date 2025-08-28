"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  SortAsc, 
  Download, 
  Upload,
  Calendar,
  X
} from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface AdminTableFiltersProps {
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, string>) => void
  onExport?: () => void
  onImport?: () => void
  searchPlaceholder?: string
  filters?: {
    status?: FilterOption[]
    category?: FilterOption[]
    dateRange?: FilterOption[]
  }
}

export function AdminTableFilters({
  onSearch,
  onFilter,
  onExport,
  onImport,
  searchPlaceholder = "Search...",
  filters = {}
}: AdminTableFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters }
    if (value === "all" || !value) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    setActiveFilters(newFilters)
    onFilter?.(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    setSearchQuery("")
    onFilter?.({})
    onSearch?.("")
  }

  const handleExport = () => {
    onExport?.()
    toast({
      title: "Export Started",
      description: "Your data export is being prepared..."
    })
  }

  const handleImport = () => {
    onImport?.()
    toast({
      title: "Import Data",
      description: "Please select a file to import"
    })
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
      {/* Search and Primary Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {filters.status && (
          <Select onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {filters.status.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filters.category && (
          <Select onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filters.category.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filters.dateRange && (
          <Select onValueChange={(value) => handleFilterChange("dateRange", value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {filters.dateRange.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button variant="outline" size="sm">
          <SortAsc className="h-4 w-4 mr-2" />
          Sort
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {key}: {value}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange(key, "")}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
