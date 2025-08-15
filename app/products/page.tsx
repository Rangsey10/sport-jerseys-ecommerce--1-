import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"
import { ProductSort } from "@/components/product-sort"

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">Sport Jerseys</h1>
            <p className="text-gray-600">Discover authentic jerseys from your favorite teams</p>
          </div>
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="sticky top-4">
              <ProductFilters />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Showing all products</p>
              <ProductSort />
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
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
