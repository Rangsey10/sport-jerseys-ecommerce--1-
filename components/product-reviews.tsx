"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  size: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "John D.",
    rating: 5,
    title: "Amazing quality!",
    content:
      "This jersey exceeded my expectations. The material is top-notch and the fit is perfect. Definitely authentic!",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    size: "L",
  },
  {
    id: "2",
    author: "Sarah M.",
    rating: 4,
    title: "Great jersey, fast shipping",
    content: "Love the jersey! Colors are vibrant and it arrived quickly. Only minor issue is it runs slightly small.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
    size: "M",
  },
  {
    id: "3",
    author: "Mike R.",
    rating: 5,
    title: "Perfect for game day",
    content: "Wore this to the game and got so many compliments. Quality is excellent and it's very comfortable.",
    date: "2024-01-05",
    verified: false,
    helpful: 15,
    size: "XL",
  },
]

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews)
  const [sortBy, setSortBy] = useState("newest")

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Rating Summary */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex items-center justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            {reviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{review.author}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          Size: {review.size}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Not Helpful
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">Load More Reviews</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
