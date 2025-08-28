
'use client'
import { useEffect, useState } from "react"
import { createSafeClientComponentClient } from "@/lib/supabase/safe-clients"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let subscription: any = null

    const initAuth = async () => {
      try {
        const supabase = await createSafeClientComponentClient()
        
        if (!supabase || !mounted) {
          setLoading(false)
          return
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setUser(session?.user || null)
          setLoading(false)
        }

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setUser(session?.user || null)
            setLoading(false)
          }
        })
        
        subscription = authSubscription
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    initAuth()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const supabase = await createSafeClientComponentClient()
      if (supabase) {
        await supabase.auth.signOut()
        setUser(null)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return { user, loading, signOut }
}
