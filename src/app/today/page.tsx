import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import DailyFlow from '@/components/daily/DailyFlow'
import type { Profile, Track, TrackMission, Platform, PlatformPrompt, CreativePrompt, Mood, DailyCompletion } from '@/lib/types'

export default async function TodayPage() {
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

  // Get today's local date string
  const today = new Date()
  const todayLocal = today.toISOString().split('T')[0]

  // Get all required data in parallel
  const [
    trackRes,
    missionRes,
    platformsRes,
    promptsRes,
    creativePromptsRes,
    moodsRes,
    completionRes,
    streakRes,
  ] = await Promise.all([
    // Get selected track
    supabase.from('tracks').select('*').eq('id', profile.selected_track).single(),
    // Get today's mission
    supabase.from('track_missions')
      .select('*')
      .eq('track_id', profile.selected_track)
      .eq('day_number', profile.current_day)
      .single(),
    // Get selected platforms
    supabase.from('platforms')
      .select('*')
      .in('id', profile.selected_platforms || [])
      .order('sort_order'),
    // Get prompts for selected platforms
    supabase.from('platform_prompts')
      .select('*')
      .in('platform_id', profile.selected_platforms || [])
      .order('prompt_number'),
    // Get creative prompts
    supabase.from('creative_prompts')
      .select('*')
      .order('sort_order'),
    // Get moods
    supabase.from('moods').select('*').order('sort_order'),
    // Get today's completions (could be multiple - one per mode)
    supabase.from('daily_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date_local', todayLocal),
    // Get streak
    supabase.from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  const track = trackRes.data as Track
  const mission = missionRes.data as TrackMission
  const platforms = (platformsRes.data || []) as Platform[]
  const prompts = (promptsRes.data || []) as PlatformPrompt[]
  const creativePrompts = (creativePromptsRes.data || []) as CreativePrompt[]
  const moods = (moodsRes.data || []) as Mood[]
  const completions = (completionRes.data || []) as DailyCompletion[]
  const streak = streakRes.data as { current_streak: number; longest_streak: number } | null

  // Check which modes have been completed today
  const structuredDone = completions.some(c => c.mode_used === 'structured' && c.completed_at)
  const creativeDone = completions.some(c => c.mode_used === 'creative' && c.completed_at)

  return (
    <>
      <DailyFlow
        userId={user.id}
        profile={profile}
        track={track}
        mission={mission}
        platforms={platforms}
        prompts={prompts}
        creativePrompts={creativePrompts}
        moods={moods}
        todayLocal={todayLocal}
        structuredDone={structuredDone}
        creativeDone={creativeDone}
        currentStreak={streak?.current_streak || 0}
        longestStreak={streak?.longest_streak || 0}
      />
      <Navigation current="today" />
    </>
  )
}
