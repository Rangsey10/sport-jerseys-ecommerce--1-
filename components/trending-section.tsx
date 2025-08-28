"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const trendingItems = [
  {
    name: "NBA Collection",
    image: "/Stephen curry.png",
    description: "Latest NBA jerseys from your favorite teams",
    link: "/categories/nba"
  },
  {
    name: "Soccer Stars",
    image: "/messifeature.png",
    description: "International soccer jerseys from legendary players",
    link: "/categories/soccer"
  },
  {
    name: "NFL Favorites",
    image: "/Mahomes.png",
    description: "Official NFL jerseys for the true fans",
    link: "/categories/nfl"
  }
]

export function TrendingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trending Now</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out what's hot in the world of sports jerseys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <Card className="group cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-80">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-200 mb-4">{item.description}</p>
                      <Button
                        variant="secondary"
                        className="group-hover:translate-x-2 transition-transform duration-300"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
