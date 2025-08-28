import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect logged-in users from landing page to /homepage
  if (req.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/homepage", req.url))
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      console.log('No session, redirecting to login')
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Check if user is admin
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    console.log('Admin route access attempt:', {
      userId: session.user.id,
      userRole: profile?.role,
      pathname: req.nextUrl.pathname,
      error: error?.message
    })

    if (profile?.role !== "admin") {
      console.log('User is not admin, redirecting to homepage')
      return NextResponse.redirect(new URL("/homepage", req.url))
    }

    console.log('Admin access granted')
  }

  // Protect checkout, cart, and orders routes
  if (req.nextUrl.pathname.startsWith("/checkout") || 
      req.nextUrl.pathname.startsWith("/orders") || 
      req.nextUrl.pathname.startsWith("/cart")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/", "/admin/:path*", "/checkout/:path*", "/orders/:path*", "/cart/:path*"],
}
