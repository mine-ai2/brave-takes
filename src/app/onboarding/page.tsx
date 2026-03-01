'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Track, Platform } from '@/lib/types'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [tracks, setTracks] = useState<Track[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedTrack, setSelectedTrack] = useState<string>('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load tracks and platforms
  useEffect(() => {
    async function loadData() {
      const [tracksRes, platformsRes] = await Promise.all([
        supabase.from('tracks').select('*').order('sort_order'),
        supabase.from('platforms').select('*').order('sort_order'),
      ])
      
      if (tracksRes.data) setTracks(tracksRes.data)
      if (platformsRes.data) setPlatforms(platformsRes.data)
      setLoading(false)
    }
    loadData()
  }, [supabase])

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleComplete = async () => {
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        selected_track: selectedTrack,
        selected_platforms: selectedPlatforms,
        current_day: 1,
        onboarding_complete: true,
      })

    if (error) {
      console.error('Error saving profile:', error)
      setSaving(false)
      return
    }

    router.push('/today')
  }

  const getTrackColors = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; selected: string }> = {
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', selected: 'border-emerald-500 bg-emerald-100' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', selected: 'border-blue-500 bg-blue-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', selected: 'border-purple-500 bg-purple-100' },
    }
    return colors[color] || colors.emerald
  }

  const getPlatformColors = (color: string) => {
    const colors: Record<string, { bg: string; selected: string }> = {
      pink: { bg: 'bg-pink-50', selected: 'border-pink-500 bg-pink-100' },
      blue: { bg: 'bg-blue-50', selected: 'border-blue-500 bg-blue-100' },
      red: { bg: 'bg-red-50', selected: 'border-red-500 bg-red-100' },
      gray: { bg: 'bg-slate-50', selected: 'border-slate-500 bg-slate-100' },
      teal: { bg: 'bg-teal-50', selected: 'border-teal-500 bg-teal-100' },
      indigo: { bg: 'bg-indigo-50', selected: 'border-indigo-500 bg-indigo-100' },
    }
    return colors[color] || colors.pink
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🦁</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {step === 1 ? 'Choose Your Track' : 'Select Your Platforms'}
          </h1>
          <p className="text-slate-600">
            {step === 1 
              ? 'Pick the journey that matches where you are right now.'
              : 'Which platforms will you be creating on?'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-16 rounded-full transition-colors ${
                i <= step ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {/* Step 1: Track Selection */}
          {step === 1 && (
            <div className="space-y-4">
              {tracks.map((track) => {
                const colors = getTrackColors(track.color)
                const isSelected = selectedTrack === track.id
                
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? colors.selected
                        : `${colors.bg} ${colors.border} hover:border-slate-300`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{track.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${colors.text}`}>
                          {track.name}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          {track.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
              
              <button
                onClick={() => selectedTrack && setStep(2)}
                disabled={!selectedTrack}
                className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Platform Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 text-center mb-4">
                Select at least one platform. You can change this later.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const colors = getPlatformColors(platform.color)
                  const isSelected = selectedPlatforms.includes(platform.id)
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? colors.selected
                          : `${colors.bg} border-slate-200 hover:border-slate-300`
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-2xl block mb-1">{platform.icon}</span>
                        <span className="text-sm font-medium text-slate-700">
                          {platform.name}
                        </span>
                        {isSelected && (
                          <div className="mt-2 w-5 h-5 mx-auto bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={selectedPlatforms.length === 0 || saving}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
                >
                  {saving ? 'Saving...' : 'Start My Journey 🦁'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          21 days to build your brave content habit
        </p>
      </div>
    </div>
  )
}
