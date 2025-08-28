import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProductGrid } from "@/components/product-grid"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCategories />
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Best Sellers</h2>
          <ProductGrid searchParams={{ featured: "true" }} limit={8} />
        </div>
      </section>
      <NewsletterSection />
    </div>
  )
}
