"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get supabase client
      const supabase = await createSafeClientComponentClient()
      
      // Check if supabase client is available
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to authentication service",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Auth error:', error)
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      if (!data.user) {
        toast({
          title: "Login failed",
          description: "No user data received",
          variant: "destructive",
        })
        return
      }

      // Check user role from profile
      console.log('Looking up profile for user:', data.user.id)
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single()

      console.log('Profile lookup result:', { profile, profileError, userId: data.user.id })

      if (profileError) {
        console.error('Profile lookup error:', profileError)
        toast({
          title: "Profile Error",
          description: "Could not load user profile. Redirecting to homepage.",
          variant: "destructive",
        })
        router.push("/homepage")
        return
      }

      const userRole = profile?.role || 'customer'
      const userName = profile?.full_name || data.user.email?.split('@')[0] || 'User'
      console.log('User role determined:', userRole)
      console.log('Full profile data:', profile)

      toast({
        title: "Login successful!",
        description: `Welcome back, ${userName}! (${userRole})`,
      })

      // Redirect based on role with explicit logging
      if (userRole === 'admin') {
        console.log('🔑 Admin user detected - Redirecting to /admin')
        setTimeout(() => {
          router.push("/admin")
          router.refresh()
        }, 1000)
      } else {
        console.log('👤 Regular user detected - Redirecting to /homepage')
        setTimeout(() => {
          router.push("/homepage")
          router.refresh()
        }, 1000)
      }
      
      // Refresh after navigation
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2.5 top-2.5 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/register" className="ml-1 underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
