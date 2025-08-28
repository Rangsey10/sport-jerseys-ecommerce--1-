
'use client'
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, LogOut } from "lucide-react"

export function LandingNavBar() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={user ? "/homepage" : "/"} className="flex items-center gap-2 font-bold text-xl">
            <Icons.logo className="h-7 w-7" />
            Jersey Store
          </Link>
          <Link href="/products" className="ml-6 hover:text-blue-300 transition-colors">Products</Link>
          <Link href="/categories" className="ml-4 hover:text-blue-300 transition-colors">Categories</Link>
          {user && (
            <>
              <Link href="/bestsellers" className="ml-4 hover:text-blue-300 transition-colors">Bestsellers</Link>
              <Link href="/new-arrivals" className="ml-4 hover:text-blue-300 transition-colors">New Arrivals</Link>
              <Link href="/deals" className="ml-4 hover:text-blue-300 transition-colors">Deals</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/orders" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-red-500 text-white border-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
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
