import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Use environment variable if available, otherwise use request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  
  // Check if there's a redirectTo parameter for where to go after auth
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${baseUrl}${redirectTo}`)
} 