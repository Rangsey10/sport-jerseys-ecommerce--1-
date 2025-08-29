"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"

export default function TestRegistrationPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test123456")
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to Supabase",
          variant: "destructive"
        })
        return
      }

      console.log('🧪 Testing registration for:', email)

      // Test registration
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: email.split('@')[0],
            role: 'customer',
          },
        },
      })

      if (error) {
        console.error('❌ Registration error:', error)
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      if (data.user) {
        console.log('✅ User created:', data.user.id)
        
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Check if profile was created
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('❌ Profile check error:', profileError)
          toast({
            title: "Profile Check Failed",
            description: profileError.message,
            variant: "destructive"
          })
        } else {
          console.log('✅ Profile found:', profile)
          toast({
            title: "Registration Successful! 🎉",
            description: `User created with profile. Role: ${profile.role}`,
          })
        }
      }
    } catch (error) {
      console.error('❌ Test error:', error)
      toast({
        title: "Test Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setLoading(true)
    
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to Supabase",
          variant: "destructive"
        })
        return
      }

      // Test database connection
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' })
      
      if (error) {
        console.error('❌ Database error:', error)
        toast({
          title: "Database Connection Failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Database Connected! ✅",
          description: `Found ${data.length} profiles in database`,
        })
      }
    } catch (error) {
      console.error('❌ Database test error:', error)
      toast({
        title: "Database Test Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Test Page</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Database Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testDatabase} disabled={loading}>
                Test Database Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test User Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Test Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password (auto-filled)</Label>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  readOnly
                />
              </div>
              <Button onClick={testRegistration} disabled={loading || !email}>
                {loading ? "Testing..." : "Test Registration"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>1.</strong> First, test database connection</p>
              <p><strong>2.</strong> Enter a test email address</p>
              <p><strong>3.</strong> Click "Test Registration"</p>
              <p><strong>4.</strong> Check browser console for detailed logs</p>
              <p><strong>5.</strong> If successful, you can go to the regular registration page</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
