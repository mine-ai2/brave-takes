'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Track, TrackMission, Platform, PlatformPrompt, Mood, DailyCompletion } from '@/lib/types'
import MoodCheckIn from './MoodCheckIn'
import AffirmationDisplay from './AffirmationDisplay'
import MissionCard from './MissionCard'
import PlatformPromptCard from './PlatformPromptCard'
import CompletionCelebration from './CompletionCelebration'

type FlowStep = 'mood' | 'affirmation' | 'mission' | 'prompt' | 'complete' | 'already-done'

interface Props {
  userId: string
  profile: Profile
  track: Track
  mission: TrackMission
  platforms: Platform[]
  prompts: PlatformPrompt[]
  moods: Mood[]
  todayLocal: string
  existingCompletion: DailyCompletion | null
  currentStreak: number
  longestStreak: number
}

export default function DailyFlow({
  userId,
  profile,
  track,
  mission,
  platforms,
  prompts,
  moods,
  todayLocal,
  existingCompletion,
  currentStreak,
  longestStreak,
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<FlowStep>(existingCompletion?.completed_at ? 'already-done' : 'mood')
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('')
  const [selectedPrompt, setSelectedPrompt] = useState<PlatformPrompt | null>(null)
  const [saving, setSaving] = useState(false)

  // Get a random prompt from the user's selected platforms
  const getRandomPrompt = () => {
    if (prompts.length === 0) return null
    const randomIndex = Math.floor(Math.random() * prompts.length)
    return prompts[randomIndex]
  }

  // Handle mood selection
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood)
    // Use the mood's affirmation
    setCurrentAffirmation(mood.affirmation)
    setStep('affirmation')
  }

  // Handle affirmation continue
  const handleAffirmationContinue = () => {
    setStep('mission')
  }

  // Handle mission continue
  const handleMissionContinue = () => {
    const prompt = getRandomPrompt()
    setSelectedPrompt(prompt)
    setStep('prompt')
  }

  // Handle completion
  const handleComplete = async () => {
    setSaving(true)
    
    try {
      // Save the daily completion
      const { error } = await supabase
        .from('daily_completions')
        .upsert({
          user_id: userId,
          date_local: todayLocal,
          mood_id: selectedMood?.id,
          affirmation_shown: currentAffirmation,
          mission_id: mission?.id,
          platform_prompt_id: selectedPrompt?.id,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date_local',
        })

      if (error) throw error

      // Update profile current_day (cycle through 1-21)
      const nextDay = profile.current_day >= 21 ? 1 : profile.current_day + 1
      await supabase
        .from('profiles')
        .update({ current_day: nextDay })
        .eq('id', userId)

      setStep('complete')
      router.refresh()
    } catch (err) {
      console.error('Error saving completion:', err)
    }
    
    setSaving(false)
  }

  // Get platform for current prompt
  const getCurrentPlatform = () => {
    if (!selectedPrompt) return null
    return platforms.find(p => p.id === selectedPrompt.platform_id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mb-4">
            <span className="text-lg">{track?.icon || '🦁'}</span>
            <span className="font-medium text-slate-700">Day {profile.current_day}</span>
            {currentStreak > 0 && (
              <span className="text-orange-500 flex items-center gap-1">
                <span>🔥</span>
                <span>{currentStreak}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {track?.name || 'Your Journey'}
          </h1>
        </div>

        {/* Flow Steps */}
        {step === 'mood' && (
          <MoodCheckIn moods={moods} onSelect={handleMoodSelect} />
        )}

        {step === 'affirmation' && (
          <AffirmationDisplay
            mood={selectedMood!}
            affirmation={currentAffirmation}
            onContinue={handleAffirmationContinue}
          />
        )}

        {step === 'mission' && (
          <MissionCard
            mission={mission}
            track={track}
            dayNumber={profile.current_day}
            onContinue={handleMissionContinue}
          />
        )}

        {step === 'prompt' && selectedPrompt && (
          <PlatformPromptCard
            prompt={selectedPrompt}
            platform={getCurrentPlatform()!}
            onComplete={handleComplete}
            saving={saving}
          />
        )}

        {step === 'complete' && (
          <CompletionCelebration
            streak={currentStreak + 1}
            dayNumber={profile.current_day}
            longestStreak={Math.max(longestStreak, currentStreak + 1)}
          />
        )}

        {step === 'already-done' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              You&apos;ve already completed today!
            </h2>
            <p className="text-slate-600 mb-6">
              Come back tomorrow for your next mission. Rest up, you&apos;ve earned it.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
                  <div className="text-sm text-slate-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">{longestStreak}</div>
                  <div className="text-sm text-slate-500">Longest</div>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              Next mission: Day {profile.current_day >= 21 ? 1 : profile.current_day + 1}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
