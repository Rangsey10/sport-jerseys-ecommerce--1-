import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { ProductSort } from "@/components/product-sort"

interface NewArrivalsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewArrivalsPage({ searchParams }: NewArrivalsPageProps) {
  const resolvedSearchParams = await searchParams
  
  // Add new arrivals filter to search params
  const newArrivalsSearchParams = {
    ...resolvedSearchParams,
    newArrivals: "true"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">New Arrivals</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the latest jerseys from your favorite teams and players
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Fresh drops every week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Jersey Drops</h2>
            <p className="text-gray-600">Brand new designs and classic favorites just arrived</p>
          </div>
          <div className="flex items-center gap-4">
            <ProductSort />
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid searchParams={newArrivalsSearchParams} />
        </Suspense>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Be the first to get your hands on the hottest jersey releases. New arrivals added regularly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-sm font-medium">NBA</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">NFL</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium">MLB</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-sm font-medium">Soccer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 h-6 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
