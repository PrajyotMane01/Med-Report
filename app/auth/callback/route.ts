import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/signin?error=${error}`)
  }

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}/signin?error=auth_failed`)
      }
    } catch (err) {
      console.error('Exception during auth exchange:', err)
      return NextResponse.redirect(`${requestUrl.origin}/signin?error=auth_failed`)
    }
  }

  // Use environment variable if available, otherwise use request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  
  // Check if there's a redirectTo parameter for where to go after auth
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${baseUrl}${redirectTo}`)
} 