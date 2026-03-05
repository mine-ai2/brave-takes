import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/today'
  
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

      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete, selected_track')
          .eq('id', user.id)
          .single()
        
        // If no profile or onboarding not complete, redirect to welcome flow
        if (!profile || !profile.onboarding_complete || !profile.selected_track) {
          return NextResponse.redirect(`${baseUrl}/welcome`)
        }
      }
      
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${baseUrl}/login?error=auth`)
}
