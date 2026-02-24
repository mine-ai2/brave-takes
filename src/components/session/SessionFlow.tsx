'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  SessionStep,
  SESSION_STEPS,
  SessionState,
  GoalCategory,
  PostType,
} from '@/lib/session-types'
import SessionProgress from './SessionProgress'
import CheckInStep from './CheckInStep'
import GoalStep from './GoalStep'
import IdentityStep from './IdentityStep'
import ResetStep from './ResetStep'
import RepBuilderStep from './RepBuilderStep'
import RecordingStudio from './RecordingStudio'
import ReflectionStep from './ReflectionStep'
import CelebrationStep from './CelebrationStep'

interface Props {
  userId: string
  todayLocal: string
  dayNumber: number
  streak: number
  initialSession?: SessionState | null
}

export default function SessionFlow({
  userId,
  todayLocal,
  dayNumber,
  streak,
  initialSession,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  // Session state
  const [currentStep, setCurrentStep] = useState<SessionStep>(
    initialSession?.current_step || 'checkin'
  )
  const [completedSteps, setCompletedSteps] = useState<SessionStep[]>([])
  const [sessionData, setSessionData] = useState<Partial<SessionState>>({
    user_id: userId,
    date_local: todayLocal,
    anxiety_level: initialSession?.anxiety_level,
    thought_tag: initialSession?.thought_tag,
    goal_category: initialSession?.goal_category,
    boldness_level: initialSession?.boldness_level,
    action_steps: initialSession?.action_steps,
    selected_action: initialSession?.selected_action,
    identity_choice: initialSession?.identity_choice,
    meditation_track: initialSession?.meditation_track,
    meditation_duration: initialSession?.meditation_duration,
    post_type: initialSession?.post_type,
    post_framework: initialSession?.post_framework,
    post_draft: initialSession?.post_draft,
    recording_url: initialSession?.recording_url,
    reflection_note: initialSession?.reflection_note,
  })
  const [saving, setSaving] = useState(false)

  // Save session state to Supabase
  const saveSession = useCallback(async (data: Partial<SessionState>, step: SessionStep) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('session_states')
        .upsert({
          user_id: userId,
          date_local: todayLocal,
          current_step: step,
          ...data,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date_local',
        })
      
      if (error) {
        console.error('Error saving session:', error)
      }
    } catch (err) {
      console.error('Error saving session:', err)
    }
    setSaving(false)
  }, [supabase, userId, todayLocal])

  // Mark session complete
  const completeSession = useCallback(async () => {
    try {
      await supabase
        .from('session_states')
        .update({
          completed_at: new Date().toISOString(),
          current_step: 'celebration',
        })
        .eq('user_id', userId)
        .eq('date_local', todayLocal)

      // Also create a rep_completion for backward compatibility
      await supabase
        .from('rep_completions')
        .upsert({
          user_id: userId,
          date_local: todayLocal,
          status: 'done',
        }, {
          onConflict: 'user_id,date_local',
        })
    } catch (err) {
      console.error('Error completing session:', err)
    }
  }, [supabase, userId, todayLocal])

  // Navigate to next step
  const goToStep = (step: SessionStep) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep])
    setCurrentStep(step)
  }

  const nextStep = () => {
    const currentIndex = SESSION_STEPS.indexOf(currentStep)
    if (currentIndex < SESSION_STEPS.length - 1) {
      goToStep(SESSION_STEPS[currentIndex + 1])
    }
  }

  // Step handlers
  const handleCheckinComplete = (anxiety: number, thoughtTag: string) => {
    const newData = { ...sessionData, anxiety_level: anxiety, thought_tag: thoughtTag }
    setSessionData(newData)
    saveSession(newData, 'goal')
    nextStep()
  }

  const handleGoalComplete = (
    category: GoalCategory,
    boldness: number,
    actions: string[],
    selectedAction: string
  ) => {
    const newData = {
      ...sessionData,
      goal_category: category,
      boldness_level: boldness,
      action_steps: actions,
      selected_action: selectedAction,
    }
    setSessionData(newData)
    saveSession(newData, 'identity')
    nextStep()
  }

  const handleIdentityComplete = (choice: 'impressive' | 'useful') => {
    const newData = { ...sessionData, identity_choice: choice }
    setSessionData(newData)
    saveSession(newData, 'reset')
    nextStep()
  }

  const handleResetComplete = (track: string, duration: number) => {
    const newData = { ...sessionData, meditation_track: track, meditation_duration: duration }
    setSessionData(newData)
    saveSession(newData, 'repbuilder')
    nextStep()
  }

  const handleRepBuilderComplete = (postType: PostType, framework: string, draft: string) => {
    const newData = { ...sessionData, post_type: postType, post_framework: framework, post_draft: draft }
    setSessionData(newData)
    saveSession(newData, 'studio')
    nextStep()
  }

  const handleStudioComplete = (recordingUrl: string | null) => {
    const newData = { ...sessionData, recording_url: recordingUrl || undefined }
    setSessionData(newData)
    saveSession(newData, 'reflection')
    nextStep()
  }

  const handleReflectionComplete = (note: string) => {
    const newData = { ...sessionData, reflection_note: note }
    setSessionData(newData)
    saveSession(newData, 'celebration')
    nextStep()
  }

  const handleCelebrationComplete = async () => {
    await completeSession()
    router.push('/progress')
    router.refresh()
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'checkin':
        return (
          <CheckInStep
            initialAnxiety={sessionData.anxiety_level}
            initialTag={sessionData.thought_tag}
            onComplete={handleCheckinComplete}
          />
        )
      case 'goal':
        return (
          <GoalStep
            initialCategory={sessionData.goal_category}
            initialBoldness={sessionData.boldness_level}
            initialAction={sessionData.selected_action}
            onComplete={handleGoalComplete}
          />
        )
      case 'identity':
        return (
          <IdentityStep
            initialChoice={sessionData.identity_choice}
            onComplete={handleIdentityComplete}
          />
        )
      case 'reset':
        return (
          <ResetStep
            initialTrack={sessionData.meditation_track}
            initialDuration={sessionData.meditation_duration}
            onComplete={handleResetComplete}
          />
        )
      case 'repbuilder':
        return (
          <RepBuilderStep
            initialPostType={sessionData.post_type}
            initialFramework={sessionData.post_framework}
            initialDraft={sessionData.post_draft}
            selectedAction={sessionData.selected_action}
            onComplete={handleRepBuilderComplete}
          />
        )
      case 'studio':
        return (
          <RecordingStudio
            postDraft={sessionData.post_draft}
            onComplete={handleStudioComplete}
          />
        )
      case 'reflection':
        return (
          <ReflectionStep
            selectedAction={sessionData.selected_action}
            initialNote={sessionData.reflection_note}
            onComplete={handleReflectionComplete}
          />
        )
      case 'celebration':
        return (
          <CelebrationStep
            streak={streak + 1}
            dayNumber={dayNumber}
            onComplete={handleCelebrationComplete}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-4">
          <p className="text-amber-600 font-medium">Day {dayNumber}</p>
          {streak > 0 && (
            <p className="text-orange-500 text-sm">🔥 {streak} day streak!</p>
          )}
        </div>

        {/* Progress */}
        {currentStep !== 'celebration' && (
          <SessionProgress currentStep={currentStep} completedSteps={completedSteps} />
        )}

        {/* Current Step */}
        {renderStep()}

        {/* Saving indicator */}
        {saving && (
          <div className="fixed bottom-20 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
            Saving...
          </div>
        )}
      </div>
    </div>
  )
}
