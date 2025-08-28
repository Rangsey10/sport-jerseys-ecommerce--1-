import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProductGrid } from "@/components/product-grid"

export default function Homepage() {
  return (
    <div className="min-h-screen">
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
          <ProductGrid searchParams={{ featured: "true" }} limit={8} />
        </div>
      </section>
      <NewsletterSection />
    </div>
  )
}
