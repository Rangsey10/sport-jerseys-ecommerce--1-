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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // default to customer
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('🔄 Starting registration process...')
      
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to authentication service",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: fullName,
            role: formData.role,
          },
        },
      })

      if (error) {
        console.error('❌ Registration error:', error)
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('✅ User created successfully:', data.user.id)
        
        // The profile will be created automatically by the database trigger
        // But let's ensure it has the correct role
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second for trigger
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              role: formData.role,
              full_name: fullName
            })
            .eq('id', data.user.id)
          
          if (updateError) {
            console.warn('⚠️ Profile update error:', updateError)
            // Don't fail registration for this
          } else {
            console.log('✅ Profile updated with role:', formData.role)
          }
        } catch (profileError) {
          console.warn('⚠️ Profile setup warning:', profileError)
          // Don't fail registration for this
        }
        
        toast({
          title: "Account created successfully! 🎉",
          description: `Welcome ${formData.role === 'admin' ? 'Administrator' : 'Customer'}! Please check your email to verify your account, then you can sign in.`,
        })
        
        // Redirect to login page
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Max"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Robinson"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Choose "Customer" to shop and purchase jerseys, or "Administrator" to manage products and orders.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="ml-1 underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
