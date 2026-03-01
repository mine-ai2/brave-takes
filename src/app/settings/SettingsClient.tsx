'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Track, Platform } from '@/lib/types'

interface Props {
  profile: Profile | null
  tracks: Track[]
  platforms: Platform[]
  userEmail: string
}

export default function SettingsClient({ profile, tracks, platforms, userEmail }: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  const [selectedTrack, setSelectedTrack] = useState(profile?.selected_track || '')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(profile?.selected_platforms || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    if (!profile) return
    
    setSaving(true)
    
    const { error } = await supabase
      .from('profiles')
      .update({
        selected_track: selectedTrack,
        selected_platforms: selectedPlatforms,
      })
      .eq('id', profile.id)

    if (!error) {
      setSaved(true)
      router.refresh()
    }
    
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleResetProgress = async () => {
    if (!confirm('Are you sure? This will reset your current day to Day 1.')) return
    
    if (!profile) return
    
    await supabase
      .from('profiles')
      .update({ current_day: 1 })
      .eq('id', profile.id)

    router.refresh()
  }

  const currentTrack = tracks.find(t => t.id === selectedTrack)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
          <p className="text-slate-500">Customize your experience</p>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Account</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Email</label>
              <p className="text-slate-800 font-medium">{userEmail}</p>
            </div>
            
            <div>
              <label className="text-sm text-slate-500">Current Progress</label>
              <p className="text-slate-800 font-medium">
                Day {profile?.current_day || 1} of 21
              </p>
            </div>
          </div>
        </div>

        {/* Track Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Your Track</h2>
          
          <div className="space-y-3">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrack(track.id)
                  setSaved(false)
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTrack === track.id
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{track.icon}</span>
                  <div>
                    <h3 className="font-medium text-slate-800">{track.name}</h3>
                    <p className="text-sm text-slate-500">{track.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Your Platforms</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xl block mb-1">{platform.icon}</span>
                <span className="text-xs text-slate-600">{platform.name}</span>
              </button>
            ))}
          </div>
          
          {selectedPlatforms.length === 0 && (
            <p className="text-sm text-amber-600 mt-3">
              Please select at least one platform
            </p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || selectedPlatforms.length === 0}
          className={`w-full py-3.5 px-4 font-semibold rounded-xl transition-all mb-6 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
          <h2 className="font-semibold text-slate-800 mb-4">Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleResetProgress}
              className="w-full py-3 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all text-sm"
            >
              Reset Progress to Day 1
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          <p>Brave Takes v2.0</p>
          <p className="mt-1">Made with 🦁 for brave creators</p>
        </div>
      </div>
    </div>
  )
}
