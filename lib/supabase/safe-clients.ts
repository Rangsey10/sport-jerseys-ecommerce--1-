// This file provides safe Supabase client creation that won't fail during build
// when environment variables are not available

export const createSafeServerClient = async () => {
  try {
    // Check if we're in a build environment or missing env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    // Dynamic import to avoid module-level errors
    const { createServerComponentClient } = await import("@supabase/auth-helpers-nextjs")
    const { cookies } = await import("next/headers")
    
    const cookieStore = cookies()
    return createServerComponentClient({ cookies: () => cookieStore })
  } catch (error) {
    console.warn('Could not create Supabase server client:', error)
    return null
  }
}

export const createSafeMiddlewareClient = async (req: any, res: any) => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const { createMiddlewareClient } = await import("@supabase/auth-helpers-nextjs")
    return createMiddlewareClient({ req, res })
  } catch (error) {
    console.warn('Could not create Supabase middleware client:', error)
    return null
  }
}

export const createSafeRouteHandlerClient = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const { createRouteHandlerClient } = await import("@supabase/auth-helpers-nextjs")
    const { cookies } = await import("next/headers")
    
    return createRouteHandlerClient({ cookies })
  } catch (error) {
    console.warn('Could not create Supabase route handler client:', error)
    return null
  }
}

export const createSafeClientComponentClient = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
    return createClientComponentClient()
  } catch (error) {
    console.warn('Could not create Supabase client component client:', error)
    return null
  }
}
