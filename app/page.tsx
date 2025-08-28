import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewsletterSection } from "@/components/newsletter-section"
import { LandingNavBar } from "@/components/layout/landing-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNavBar />
      <HeroSection />
      <FeaturedCategories />
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our handpicked selection of premium jerseys from legendary players and iconic teams
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading collections...</div>}>
            <ProductGrid searchParams={{ featured: "true" }} limit={8} />
          </Suspense>
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              Explore All Collections
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      <NewsletterSection />
    </div>
  )
}
