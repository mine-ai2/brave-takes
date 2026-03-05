'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { BRAND } from '@/lib/brand'
import type { Profile, Track, TrackMission, Platform, PlatformPrompt, CreativePrompt, Mood, DailyCompletion } from '@/lib/types'
import MoodCheckIn from './MoodCheckIn'
import EmotionSlider from './EmotionSlider'
import AffirmationDisplay from './AffirmationDisplay'
import MissionCard from './MissionCard'
import PlatformSelector from './PlatformSelector'
import PlatformPromptCard from './PlatformPromptCard'
import CreativePromptCard from './CreativePromptCard'
import CompletionCelebration from './CompletionCelebration'

type FlowStep = 'welcome' | 'emotion-slider' | 'mood' | 'affirmation' | 'mission' | 'platform-select' | 'prompt' | 'complete' | 'already-done'
type Mode = 'structured' | 'creative'

interface Props {
  userId: string
  profile: Profile
  track: Track
  allMissions: TrackMission[]
  platforms: Platform[]
  prompts: PlatformPrompt[]
  creativePrompts: CreativePrompt[]
  moods: Mood[]
  todayLocal: string
  structuredDone: boolean
  creativeDone: boolean
  currentStreak: number
  longestStreak: number
}

export default function DailyFlow({
  userId,
  profile,
  track,
  allMissions,
  platforms,
  prompts,
  creativePrompts,
  moods,
  todayLocal,
  structuredDone,
  creativeDone,
  currentStreak,
  longestStreak,
}: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  // Determine initial state based on what's completed
  const getInitialStep = (): FlowStep => {
    if (structuredDone && creativeDone) return 'already-done'
    return 'welcome'  // Always start with welcome screen
  }
  
  // Determine initial mode - prefer the one not yet done
  const getInitialMode = (): Mode => {
    if (structuredDone && !creativeDone) return 'creative'
    if (creativeDone && !structuredDone) return 'structured'
    return profile.preferred_mode || 'structured'
  }
  
  const [step, setStep] = useState<FlowStep>(getInitialStep())
  const [mode, setMode] = useState<Mode>(getInitialMode())
  
  // Mission state - start with today's mission, allow shuffling
  const todaysMission = allMissions.find(m => m.day_number === profile.current_day) || allMissions[0]
  const [currentMission, setCurrentMission] = useState<TrackMission>(todaysMission)
  
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [emotionValue, setEmotionValue] = useState<number>(50)
  const [emotionLabel, setEmotionLabel] = useState<string>('')
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [selectedPlatformPrompt, setSelectedPlatformPrompt] = useState<PlatformPrompt | null>(null)
  const [selectedCreativePrompt, setSelectedCreativePrompt] = useState<CreativePrompt | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Track which modes have been completed (includes initial state + this session)
  const [completedModes, setCompletedModes] = useState<{ structured: boolean; creative: boolean }>({
    structured: structuredDone,
    creative: creativeDone,
  })

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

  // Get a random different mission
  const getRandomMission = () => {
    if (allMissions.length <= 1) return currentMission
    const otherMissions = allMissions.filter(m => m.id !== currentMission.id)
    const randomIndex = Math.floor(Math.random() * otherMissions.length)
    return otherMissions[randomIndex]
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

  // Handle emotion slider continue - goes to mood selection
  const handleEmotionContinue = (value: number, label: string) => {
    setEmotionValue(value)
    setEmotionLabel(label)
    setStep('mood')
  }

  // Handle mood selection (legacy, keeping for compatibility)
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
    setError(null)
    
    try {
      // Save the daily completion (separate record per mode)
      const { error: completionError } = await supabase
        .from('daily_completions')
        .upsert({
          user_id: userId,
          date_local: todayLocal,
          mood_id: selectedMood?.id,
          affirmation_shown: currentAffirmation,
          mission_id: currentMission?.id,
          platform_prompt_id: mode === 'structured' ? selectedPlatformPrompt?.id : null,
          creative_prompt_id: mode === 'creative' ? selectedCreativePrompt?.id : null,
          mode_used: mode,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date_local,mode_used',
        })

      if (completionError) {
        console.error('Completion error:', completionError)
        setError(`Save failed: ${completionError.message}`)
        setSaving(false)
        return
      }

      // Update profile current_day (cycle through 1-21)
      const nextDay = profile.current_day >= 21 ? 1 : profile.current_day + 1
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ current_day: nextDay })
        .eq('id', userId)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // Update streak
      const today = new Date(todayLocal)
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Get current streak record
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single()

      let newCurrentStreak = 1
      let newLongestStreak = 1

      if (streakData) {
        // Check if yesterday was completed (continuing streak)
        if (streakData.last_completed_date === yesterdayStr) {
          newCurrentStreak = (streakData.current_streak || 0) + 1
        } else if (streakData.last_completed_date === todayLocal) {
          // Already completed today, keep current streak
          newCurrentStreak = streakData.current_streak || 1
        }
        // else: streak broken, start at 1
        
        newLongestStreak = Math.max(newCurrentStreak, streakData.longest_streak || 0)
      }

      // Upsert streak record
      await supabase
        .from('user_streaks')
        .upsert({
          user_id: userId,
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_completed_date: todayLocal,
        }, {
          onConflict: 'user_id',
        })

      // Mark this mode as completed in state
      setCompletedModes(prev => ({
        ...prev,
        [mode]: true,
      }))
      setStep('complete')
      router.refresh()
    } catch (err) {
      console.error('Error saving completion:', err)
      setError('Something went wrong. Please try again.')
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
    ? 'min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-purple-50'
    : 'min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40'

  return (
    <div className={bgClass}>
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header - hidden on welcome screen */}
        {step !== 'welcome' && (
        <div className="text-center py-6">
          {/* Mode Toggle - visible during flow except on completion screens */}
          {step !== 'already-done' && step !== 'complete' && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => {
                    console.log('Clicking Structured, current mode:', mode, 'structuredDone:', structuredDone)
                    if (!structuredDone) handleModeToggle('structured')
                  }}
                  disabled={structuredDone}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    structuredDone
                      ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                      : mode === 'structured'
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {structuredDone ? '✓' : '📋'}
                  <span>Structured</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Clicking Creative, current mode:', mode, 'creativeDone:', creativeDone)
                    if (!creativeDone) handleModeToggle('creative')
                  }}
                  disabled={creativeDone}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    creativeDone
                      ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                      : mode === 'creative'
                      ? 'text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                  style={mode === 'creative' && !creativeDone ? { background: BRAND.gradients.button } : {}}
                >
                  {creativeDone ? '✓' : '🎨'}
                  <span>Creative</span>
                </button>
              </div>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100 mb-4">
            <span className="text-lg">{track?.icon || '🎙️'}</span>
            <span className="font-medium text-slate-700">Day {profile.current_day}</span>
            {currentStreak > 0 && (
              <span className="flex items-center gap-1" style={{ color: BRAND.colors.gold }}>
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
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 text-xs mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Flow Steps */}
        
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center -mt-6">
            {/* Logo Header with tagline */}
            <div className="mb-6 animate-fade-in">
              <Image
                src="/branding/logo-header.png"
                alt="Brave Takes - Confidence Training for Creative Visibility"
                width={400}
                height={300}
                className="w-full max-w-sm h-auto"
                priority
              />
            </div>

            {/* Train Show Up Shine Banner */}
            <div className="mb-8 w-full max-w-md">
              <Image
                src="/branding/tagline-banner.png"
                alt="Train • Show Up • Shine"
                width={500}
                height={100}
                className="w-full h-auto"
              />
            </div>

            {/* Day & Streak Badge */}
            <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-purple-100 mb-8">
              <span className="text-lg">{track?.icon || '🎙️'}</span>
              <span className="font-medium text-slate-700">Day {profile.current_day}</span>
              {currentStreak > 0 && (
                <span className="flex items-center gap-1" style={{ color: BRAND.colors.gold }}>
                  <span>🔥</span>
                  <span>{currentStreak} day streak</span>
                </span>
              )}
            </div>

            {/* Let's Go Button */}
            <button
              onClick={() => setStep('emotion-slider')}
              className="hover:scale-105 transition-transform active:scale-95"
            >
              <Image
                src="/branding/lets-go-button.png"
                alt="Let's Go!"
                width={280}
                height={80}
                className="w-56 h-auto"
              />
            </button>
          </div>
        )}

        {step === 'emotion-slider' && (
          <EmotionSlider onContinue={handleEmotionContinue} />
        )}

        {step === 'mood' && (
          <MoodCheckIn 
            moods={moods} 
            onSelect={handleMoodSelect}
          />
        )}

        {step === 'affirmation' && (
          <AffirmationDisplay
            mood={selectedMood}
            emotionLabel={emotionLabel}
            affirmation={currentAffirmation}
            onContinue={handleAffirmationContinue}
          />
        )}

        {step === 'mission' && (
          <MissionCard
            mission={currentMission}
            track={track}
            dayNumber={profile.current_day}
            onContinue={handleMissionContinue}
            onShuffle={() => setCurrentMission(getRandomMission())}
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
            onShuffle={() => setSelectedPlatformPrompt(getRandomPlatformPrompt(selectedPlatform.id))}
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
              className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              style={{ background: BRAND.gradients.button }}
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
            otherModeAvailable={mode === 'creative' ? !completedModes.structured : !completedModes.creative}
            isBonusRound={completedModes.structured && completedModes.creative}
            onStartOtherMode={() => {
              // Switch to the other mode and restart flow
              const newMode = mode === 'creative' ? 'structured' : 'creative'
              setMode(newMode)
              setStep('emotion-slider')
              setSelectedMood(null)
              setEmotionValue(50)
              setEmotionLabel('')
              setCurrentAffirmation('')
              setSelectedPlatform(null)
              setSelectedPlatformPrompt(null)
              setSelectedCreativePrompt(null)
            }}
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
            <p className="text-slate-600 mb-4">
              Your mission is done. Here&apos;s what you can do next:
            </p>
            
            {/* Continue Learning Options */}
            <div className="space-y-3 mb-6">
              <a
                href="/vault"
                className="block w-full py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-left hover:border-amber-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="font-medium text-slate-800">Capture Ideas</div>
                    <div className="text-sm text-slate-500">Save hooks, characters, or concepts</div>
                  </div>
                </div>
              </a>
              
              <a
                href="/lounge"
                className="block w-full py-3 px-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl text-left hover:border-rose-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-medium text-slate-800">Visit The Lounge</div>
                    <div className="text-sm text-slate-500">Connect with other creators</div>
                  </div>
                </div>
              </a>
              
              <a
                href="/progress"
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-left hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-medium text-slate-800">Review Progress</div>
                    <div className="text-sm text-slate-500">See your journey so far</div>
                  </div>
                </div>
              </a>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: BRAND.colors.gold }}>{currentStreak}</div>
                  <div className="text-sm text-slate-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: BRAND.colors.deepPurple }}>{longestStreak}</div>
                  <div className="text-sm text-slate-500">Longest</div>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Next mission: Day {profile.current_day >= 21 ? 1 : profile.current_day + 1}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
