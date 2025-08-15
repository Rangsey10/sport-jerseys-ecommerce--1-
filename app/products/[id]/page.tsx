import { Suspense } from "react"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { ProductReviews } from "@/components/product-reviews"

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail productId={params.id} />
        </Suspense>

        <div className="mt-16 space-y-16">
          <Suspense fallback={<div>Loading reviews...</div>}>
            <ProductReviews productId={params.id} />
          </Suspense>

          <section>
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <Suspense fallback={<div>Loading related products...</div>}>
              <RelatedProducts productId={params.id} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      <div className="space-y-4">
        <div className="bg-gray-300 h-96 rounded-lg"></div>
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-300 h-20 w-20 rounded-md"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-300 h-8 rounded w-3/4"></div>
        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
        <div className="bg-gray-300 h-10 rounded w-1/3"></div>
        <div className="bg-gray-300 h-32 rounded"></div>
        <div className="bg-gray-300 h-12 rounded"></div>
      </div>
    </div>
  )
}
