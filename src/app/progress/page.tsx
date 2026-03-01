import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ProgressClient from './ProgressClient'
import type { Profile, Track, DailyCompletion } from '@/lib/types'

export default async function ProgressPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null }

  if (!profile || !profile.onboarding_complete) {
    redirect('/onboarding')
  }

  // Get track info
  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.selected_track)
    .single() as { data: Track | null }

  // Get all completions
  const { data: completions } = await supabase
    .from('daily_completions')
    .select('*')
    .eq('user_id', user.id)
    .order('date_local', { ascending: false }) as { data: DailyCompletion[] | null }

  // Get streak info
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get moods for stats
  const { data: moods } = await supabase
    .from('moods')
    .select('*')
    .order('sort_order')

  return (
    <>
      <ProgressClient
        profile={profile}
        track={track}
        completions={completions || []}
        currentStreak={streak?.current_streak || 0}
        longestStreak={streak?.longest_streak || 0}
        moods={moods || []}
      />
      <Navigation current="progress" />
    </>
  )
}
