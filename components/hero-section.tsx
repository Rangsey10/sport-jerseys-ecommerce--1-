import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Sport Jerseys
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-lg">
                Authentic jerseys from your favorite teams and legendary players. Quality guaranteed, passion delivered.
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

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/placeholder.png"
                alt="Featured Jersey"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl opacity-20" />
          </div>
        </div>
      </div>
    </section>
  )
}
