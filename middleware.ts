import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect the /analyze route
  if (req.nextUrl.pathname.startsWith('/analyze') && !session) {
    // Use environment variable if available, otherwise use request origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
    const redirectUrl = new URL('/signin', baseUrl)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/analyze/:path*']
} 