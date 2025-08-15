"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail("")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <Mail className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl font-bold mb-4">Stay in the Game</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get exclusive deals, new arrivals, and insider news delivered straight to your inbox
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                required
              />
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-300">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">You're all set!</span>
            </div>
          )}

          <p className="text-sm text-blue-200 mt-4">No spam, unsubscribe at any time</p>
        </div>
      </div>
    </section>
  )
}
