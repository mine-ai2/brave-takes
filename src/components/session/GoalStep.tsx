'use client'

import { useState } from 'react'
import Affirmation from './Affirmation'
import {
  GOAL_CATEGORIES,
  BOLDNESS_LEVELS,
  ACTION_TEMPLATES,
  STEP_MICROCOPY,
  GoalCategory,
} from '@/lib/session-types'

interface Props {
  initialCategory?: GoalCategory
  initialBoldness?: number
  initialAction?: string
  onComplete: (category: GoalCategory, boldness: number, actions: string[], selectedAction: string) => void
}

export default function GoalStep({
  initialCategory,
  initialBoldness = 2,
  initialAction,
  onComplete,
}: Props) {
  const [step, setStep] = useState<'category' | 'boldness' | 'actions' | 'affirmation'>(
    initialCategory ? 'boldness' : 'category'
  )
  const [category, setCategory] = useState<GoalCategory | undefined>(initialCategory)
  const [boldness, setBoldness] = useState(initialBoldness)
  const [actions, setActions] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState(initialAction || '')

  const handleCategorySelect = (cat: GoalCategory) => {
    setCategory(cat)
    setStep('boldness')
  }

  const handleBoldnessConfirm = () => {
    if (!category) return
    // Get action templates for this category and boldness level
    const templates = ACTION_TEMPLATES[category][boldness] || ACTION_TEMPLATES[category][2]
    setActions(templates)
    setStep('actions')
  }

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    setStep('affirmation')
  }

  const handleComplete = () => {
    if (category && selectedAction) {
      onComplete(category, boldness, actions, selectedAction)
    }
  }

  const selectedCategoryData = GOAL_CATEGORIES.find(c => c.id === category)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Set Your Goal</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.goal}</p>
      </div>

      {step === 'category' && (
        <div className="space-y-3">
          <p className="text-gray-600 text-center mb-4">What do you want to focus on today?</p>
          {GOAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-lg font-medium text-gray-800">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {step === 'boldness' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selectedCategoryData?.icon}</span>
              <span className="text-lg font-semibold text-gray-800">{selectedCategoryData?.label}</span>
            </div>

            <label className="block text-lg font-medium text-gray-800 mb-4">
              How bold do you want to go?
            </label>

            <div className="space-y-3">
              {BOLDNESS_LEVELS.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setBoldness(level.level)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    boldness === level.level
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(level.level)].map((_, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${
                        boldness === level.level ? 'bg-white' : 'bg-amber-400'
                      }`} />
                    ))}
                    {[...Array(5 - level.level)].map((_, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${
                        boldness === level.level ? 'bg-amber-200' : 'bg-gray-300'
                      }`} />
                    ))}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{level.label}</p>
                    <p className={`text-sm ${boldness === level.level ? 'text-amber-100' : 'text-gray-500'}`}>
                      {level.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('category')}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleBoldnessConfirm}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 'actions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 mb-4">Pick your action for today:</p>
            <div className="space-y-3">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleActionSelect(action)}
                  className={`w-full p-4 text-left rounded-xl transition-all ${
                    selectedAction === action
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('boldness')}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            ← Change boldness
          </button>
        </div>
      )}

      {step === 'affirmation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-2">Today's action:</p>
            <p className="text-lg font-medium text-amber-900">{selectedAction}</p>
          </div>

          <Affirmation category="goal" />

          <button
            onClick={handleComplete}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Lock it in →
          </button>
        </div>
      )}
    </div>
  )
}
