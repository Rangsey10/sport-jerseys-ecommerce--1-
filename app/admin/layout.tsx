"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"
import { toast } from "@/hooks/use-toast"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = await createSafeClientComponentClient()
      
      if (!supabase) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to authentication service",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast({
          title: "Access Denied",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      // Check user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        toast({
          title: "Profile Error",
          description: "Could not verify admin access",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      if (profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      // User is authorized admin
      setIsAuthorized(true)
    } catch (error) {
      console.error('Admin access check error:', error)
      toast({
        title: "Error",
        description: "An error occurred while checking admin access",
        variant: "destructive",
      })
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Authorized admin layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}