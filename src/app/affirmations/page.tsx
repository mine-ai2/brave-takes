import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import AffirmationsClient from './AffirmationsClient'
import type { Mood } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AffirmationsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all moods (which contain affirmations)
  const { data: moods } = await supabase
    .from('moods')
    .select('*')
    .order('sort_order')

  // Get user's streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get user's profile for display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  return (
    <>
      <AffirmationsClient 
        moods={(moods || []) as Mood[]}
        currentStreak={streak?.current_streak || 0}
        displayName={profile?.display_name || null}
      />
      <Navigation current="affirmations" />
    </>
  )
}
