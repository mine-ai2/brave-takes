import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'
  
  // Use production URL - don't rely on request.url origin behind proxies
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.bravetakes.com'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Handle password recovery
      if (type === 'recovery') {
        return NextResponse.redirect(`${baseUrl}/reset-password`)
      }
      
      // Always go to welcome page after login
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${baseUrl}/login?error=auth`)
}
