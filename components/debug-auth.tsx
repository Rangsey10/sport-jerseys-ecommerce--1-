"use client"

import { useAuth } from "@/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function DebugAuth() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSessionInfo({
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
      })
    }
    checkSession()
  }, [supabase])

  if (loading) return <div className="p-4 bg-yellow-100">Auth Loading...</div>

 
}
