import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSafeRouteHandlerClient } from '@/lib/supabase/safe-clients'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const supabase = await createSafeRouteHandlerClient()
      if (supabase) {
        await supabase.auth.exchangeCodeForSession(code)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
