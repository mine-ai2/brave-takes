import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import SettingsClient from './SettingsClient'
import type { Profile, Track, Platform } from '@/lib/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null }

  // Get all tracks
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*')
    .order('sort_order') as { data: Track[] | null }

  // Get all platforms
  const { data: platforms } = await supabase
    .from('platforms')
    .select('*')
    .order('sort_order') as { data: Platform[] | null }

  return (
    <>
      <SettingsClient
        profile={profile}
        tracks={tracks || []}
        platforms={platforms || []}
        userEmail={user.email || ''}
      />
      <Navigation current="settings" />
    </>
  )
}
