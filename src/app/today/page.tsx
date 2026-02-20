import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodayClient from './TodayClient'

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

  // Get today's rep
  const { data: rep } = await supabase
    .from('reps')
    .select('*')
    .eq('ladder_name', 'mvp14')
    .eq('day_number', dayNumber)
    .single()

  // Get today's local date string
  const todayLocal = today.toISOString().split('T')[0]

  // Check if already completed today
  const { data: completion } = await supabase
    .from('rep_completions')
    .select('*')
    .eq('user_id', user.id)
    .eq('date_local', todayLocal)
    .single()

  // Get today's checkin
  const { data: checkin } = await supabase
    .from('checkins')
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

  return (
    <TodayClient
      rep={rep}
      dayNumber={dayNumber}
      completion={completion}
      checkin={checkin}
      streak={streak}
      todayLocal={todayLocal}
      userId={user.id}
    />
  )
}
