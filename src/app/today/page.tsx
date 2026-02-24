import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessionFlow } from '@/components/session'
import Navigation from '@/components/Navigation'
import type { SessionState } from '@/lib/session-types'

export default async function TodayPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get profile to calculate day number
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.user_type) {
    redirect('/onboarding')
  }

  // Calculate day number (1-14, then cycles)
  const signupDate = new Date(profile.created_at)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - signupDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const dayNumber = (diffDays % 14) + 1

  // Get today's local date string
  const todayLocal = today.toISOString().split('T')[0]

  // Get existing session state for today (for resume)
  const { data: sessionState } = await supabase
    .from('session_states')
    .select('*')
    .eq('user_id', user.id)
    .eq('date_local', todayLocal)
    .single()

  // Calculate streak
  const { data: completions } = await supabase
    .from('rep_completions')
    .select('date_local')
    .eq('user_id', user.id)
    .order('date_local', { ascending: false })

  let streak = 0
  if (completions && completions.length > 0) {
    const dates = completions.map(c => c.date_local).sort().reverse()
    let checkDate = new Date(todayLocal)
    
    for (const dateStr of dates) {
      const compDate = new Date(dateStr)
      const diff = Math.floor((checkDate.getTime() - compDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diff <= 1) {
        streak++
        checkDate = compDate
      } else {
        break
      }
    }
  }

  // Transform session state for component
  const initialSession: SessionState | null = sessionState ? {
    user_id: sessionState.user_id,
    date_local: sessionState.date_local,
    current_step: sessionState.current_step,
    anxiety_level: sessionState.anxiety_level,
    thought_tag: sessionState.thought_tag,
    goal_category: sessionState.goal_category,
    boldness_level: sessionState.boldness_level,
    action_steps: sessionState.action_steps,
    selected_action: sessionState.selected_action,
    identity_choice: sessionState.identity_choice,
    meditation_track: sessionState.meditation_track,
    meditation_duration: sessionState.meditation_duration,
    post_type: sessionState.post_type,
    post_framework: sessionState.post_framework,
    post_draft: sessionState.post_draft,
    recording_url: sessionState.recording_url,
    reflection_note: sessionState.reflection_note,
    completed_at: sessionState.completed_at,
  } : null

  return (
    <>
      <SessionFlow
        userId={user.id}
        todayLocal={todayLocal}
        dayNumber={dayNumber}
        streak={streak}
        initialSession={initialSession}
      />
      <Navigation current="today" />
    </>
  )
}
