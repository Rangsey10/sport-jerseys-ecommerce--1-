
'use client'
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function LandingNavBar() {
  const { user } = useAuth()
  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Icons.logo className="h-7 w-7" />
            Jersey Store
          </Link>
          <Link href="/products" className="ml-6 hover:text-blue-300 transition-colors">Products</Link>
          <Link href="/categories" className="ml-4 hover:text-blue-300 transition-colors">Categories</Link>
        </div>
        <div className="flex gap-4">
          {!user && (
            <>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 font-bold shadow-lg border-2 border-yellow-500 hover:scale-105 hover:shadow-xl transition-all text-lg px-8 py-3"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg border-2 border-blue-400 hover:scale-105 hover:shadow-xl transition-all text-lg px-8 py-3"
              >
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
