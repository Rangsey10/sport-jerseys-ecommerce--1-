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
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-blue-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      {/* Add animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <Mail className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-4">Join the Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get exclusive deals, early access to new releases, and VIP updates delivered to your inbox
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
              <Button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">Welcome to the team!</span>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-4">Join 50,000+ sports fans who trust us. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
