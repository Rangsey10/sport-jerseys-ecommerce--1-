"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "John D.",
    image: "/placeholder-user.jpg",
    text: "The quality of these jerseys is outstanding. Exactly like the ones worn by the pros!",
    rating: 5,
    jerseyBought: "Stephen Curry Warriors Jersey"
  },
  {
    name: "Sarah M.",
    image: "/placeholder-user.jpg",
    text: "Fast shipping and authentic products. Will definitely shop here again!",
    rating: 5,
    jerseyBought: "Lionel Messi Argentina Jersey"
  },
  {
    name: "Mike R.",
    image: "/placeholder-user.jpg",
    text: "Great selection of jerseys. Found exactly what I was looking for.",
    rating: 5,
    jerseyBought: "Tom Brady Patriots Jersey"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their jersey needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-3">{testimonial.text}</p>
                <p className="text-sm text-gray-500">Purchased: {testimonial.jerseyBought}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
