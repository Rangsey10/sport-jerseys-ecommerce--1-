import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-blue-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      {/* Add animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                New Arrivals for 2025 Season
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Authentic
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Sport Jerseys
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 max-w-lg">
                Wear the pride of your team. Premium quality jerseys from NBA, NFL, MLB, and international soccer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-blue-900 bg-transparent text-lg px-8 py-6"
                asChild
              >
                <Link href="/categories">View Collections</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-blue-200">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/CristanoRonaldo.png"
                  alt="Soccer Jersey"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/LionelMessi.png"
                  alt="Soccer Jersey"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/Stephen curry.png"
                  alt="Basketball Jersey"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/Tatum.png"
                  alt="Basketball Jersey"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
