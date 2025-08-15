import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCategories />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Jerseys</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular jerseys from top teams and legendary players
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading products...</div>}>
            <ProductGrid limit={8} />
          </Suspense>
        </div>
      </section>
      <NewsletterSection />
    </div>
  )
}
