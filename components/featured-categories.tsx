import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const categories = [
  {
    name: "Football",
    image: "/placeholder.png",
    href: "/products?category=football",
    count: "120+ Items",
    color: "bg-green-500",
  },
  {
    name: "Basketball",
    image: "LAL+MNK+DF+SWGMN+JSY+ASC+22.avif",
    href: "/products?category=basketball",
    count: "85+ Items",
    color: "bg-orange-500",
  },
  {
    name: "Soccer",
    image: "(3).jpg",
    href: "/products?category=soccer",
    count: "200+ Items",
    color: "bg-blue-500",
  },
  {
    name: "Baseball",
    image: "/placeholder-baseball.png",
    href: "/products?category=baseball",
    count: "95+ Items",
    color: "bg-red-500",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Shop by Sport</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find jerseys from your favorite sports and teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <CardContent className="p-0 relative">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <Badge className={`absolute top-4 right-4 ${category.color} text-white`}>{category.count}</Badge>
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">Explore Collection</p>
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
