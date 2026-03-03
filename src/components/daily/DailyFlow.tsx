'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Track, TrackMission, Platform, PlatformPrompt, CreativePrompt, Mood, DailyCompletion } from '@/lib/types'
import MoodCheckIn from './MoodCheckIn'
import AffirmationDisplay from './AffirmationDisplay'
import MissionCard from './MissionCard'
import PlatformSelector from './PlatformSelector'
import PlatformPromptCard from './PlatformPromptCard'
import CreativePromptCard from './CreativePromptCard'
import CompletionCelebration from './CompletionCelebration'

type FlowStep = 'mood' | 'affirmation' | 'mission' | 'platform-select' | 'prompt' | 'complete' | 'already-done'
type Mode = 'structured' | 'creative'

interface Props {
  userId: string
  profile: Profile
  track: Track
  mission: TrackMission
  platforms: Platform[]
  prompts: PlatformPrompt[]
  creativePrompts: CreativePrompt[]
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
  creativePrompts,
  moods,
  todayLocal,
  existingCompletion,
  currentStreak,
  longestStreak,
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<FlowStep>(existingCompletion?.completed_at ? 'already-done' : 'mood')
  const [mode, setMode] = useState<Mode>(profile.preferred_mode || 'structured')
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [selectedPlatformPrompt, setSelectedPlatformPrompt] = useState<PlatformPrompt | null>(null)
  const [selectedCreativePrompt, setSelectedCreativePrompt] = useState<CreativePrompt | null>(null)
  const [saving, setSaving] = useState(false)

  // Get prompts for a specific platform
  const getPromptsForPlatform = (platformId: string) => {
    return prompts.filter(p => p.platform_id === platformId)
  }

  // Get a random prompt from the selected platform
  const getRandomPlatformPrompt = (platformId: string) => {
    const platformPrompts = getPromptsForPlatform(platformId)
    if (platformPrompts.length === 0) return null
    const randomIndex = Math.floor(Math.random() * platformPrompts.length)
    return platformPrompts[randomIndex]
  }

  // Get a random creative prompt
  const getRandomCreativePrompt = () => {
    if (creativePrompts.length === 0) return null
    const randomIndex = Math.floor(Math.random() * creativePrompts.length)
    return creativePrompts[randomIndex]
  }

  // Handle mode toggle
  const handleModeToggle = async (newMode: Mode) => {
    setMode(newMode)
    // Save preference to profile
    await supabase
      .from('profiles')
      .update({ preferred_mode: newMode })
      .eq('id', userId)
  }

  // Handle mood selection
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood)
    setCurrentAffirmation(mood.affirmation)
    setStep('affirmation')
  }

  // Handle affirmation continue
  const handleAffirmationContinue = () => {
    setStep('mission')
  }

  // Handle mission continue
  const handleMissionContinue = () => {
    if (mode === 'creative') {
      const prompt = getRandomCreativePrompt()
      setSelectedCreativePrompt(prompt)
      setStep('prompt')
    } else {
      // Go to platform selection for structured mode
      setStep('platform-select')
    }
  }

  // Handle platform selection
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform)
    const prompt = getRandomPlatformPrompt(platform.id)
    setSelectedPlatformPrompt(prompt)
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
          platform_prompt_id: mode === 'structured' ? selectedPlatformPrompt?.id : null,
          creative_prompt_id: mode === 'creative' ? selectedCreativePrompt?.id : null,
          mode_used: mode,
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

  // Get category label for creative prompts
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      tone: 'Tone Exploration',
      character: 'Character Work',
      cinematic: 'Cinematic',
      trending: 'Trending',
      experimental: 'Experimental',
      craft: 'Craft Fundamentals',
    }
    return labels[category] || category
  }

  // Background class based on mode
  const bgClass = mode === 'creative' 
    ? 'min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50'
    : 'min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'

  return (
    <div className={bgClass}>
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-slate-100">
              <button
                onClick={() => handleModeToggle('structured')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  mode === 'structured'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Structured
              </button>
              <button
                onClick={() => handleModeToggle('creative')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  mode === 'creative'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Creative
              </button>
            </div>
          </div>

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
          <h1 className={`text-2xl font-bold ${mode === 'creative' ? 'font-serif text-slate-800' : 'text-slate-800'}`}>
            {mode === 'creative' ? 'Creative Practice' : (track?.name || 'Your Journey')}
          </h1>
          {mode === 'creative' && (
            <p className="text-slate-500 text-sm mt-1">Explore. Experiment. Play.</p>
          )}
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
            isCreativeMode={mode === 'creative'}
          />
        )}

        {step === 'platform-select' && mode === 'structured' && (
          <PlatformSelector
            platforms={platforms}
            onSelect={handlePlatformSelect}
          />
        )}

        {step === 'prompt' && mode === 'structured' && selectedPlatformPrompt && selectedPlatform && (
          <PlatformPromptCard
            prompt={selectedPlatformPrompt}
            platform={selectedPlatform}
            onComplete={handleComplete}
            saving={saving}
          />
        )}

        {step === 'prompt' && mode === 'structured' && !selectedPlatformPrompt && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No prompts available</h2>
            <p className="text-slate-500 mb-6">
              There are no prompts for this platform yet. Try creative mode or complete today without a specific prompt.
            </p>
            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all"
            >
              {saving ? 'Saving...' : '✅ Complete anyway'}
            </button>
          </div>
        )}

        {step === 'prompt' && mode === 'creative' && selectedCreativePrompt && (
          <CreativePromptCard
            prompt={selectedCreativePrompt}
            categoryLabel={getCategoryLabel(selectedCreativePrompt.category)}
            onComplete={handleComplete}
            onShuffle={() => setSelectedCreativePrompt(getRandomCreativePrompt())}
            saving={saving}
          />
        )}

        {step === 'prompt' && mode === 'creative' && !selectedCreativePrompt && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No creative prompts yet</h2>
            <p className="text-slate-500 mb-6">
              Creative prompts haven&apos;t been added yet. Try structured mode or complete today without a prompt.
            </p>
            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all"
            >
              {saving ? 'Saving...' : '✅ Complete anyway'}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <CompletionCelebration
            streak={currentStreak + 1}
            dayNumber={profile.current_day}
            longestStreak={Math.max(longestStreak, currentStreak + 1)}
            isCreativeMode={mode === 'creative'}
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
