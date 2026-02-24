'use client'

import { useState } from 'react'
import Affirmation from './Affirmation'
import { STEP_MICROCOPY } from '@/lib/session-types'

const THOUGHT_TAGS = [
  { id: 'excited', label: 'Excited', emoji: '✨' },
  { id: 'nervous', label: 'Nervous', emoji: '😰' },
  { id: 'procrastinating', label: 'Procrastinating', emoji: '🙈' },
  { id: 'determined', label: 'Determined', emoji: '💪' },
  { id: 'doubtful', label: 'Doubtful', emoji: '🤔' },
  { id: 'ready', label: 'Ready', emoji: '🚀' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'inspired', label: 'Inspired', emoji: '💡' },
]

interface Props {
  initialAnxiety?: number
  initialTag?: string
  onComplete: (anxiety: number, thoughtTag: string) => void
}

export default function CheckInStep({ initialAnxiety = 5, initialTag = '', onComplete }: Props) {
  const [anxiety, setAnxiety] = useState(initialAnxiety)
  const [thoughtTag, setThoughtTag] = useState(initialTag)
  const [showAffirmation, setShowAffirmation] = useState(false)

  const getAnxietyLabel = (level: number) => {
    if (level <= 2) return '😌 Calm'
    if (level <= 4) return '😊 Settled'
    if (level <= 6) return '😐 Neutral'
    if (level <= 8) return '😬 Activated'
    return '😰 Loud'
  }

  const handleContinue = () => {
    if (!showAffirmation) {
      setShowAffirmation(true)
    } else {
      onComplete(anxiety, thoughtTag)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Check In</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.checkin}</p>
      </div>

      {!showAffirmation ? (
        <>
          {/* Anxiety Slider */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-lg font-medium text-gray-800 mb-4">
              Nervous system level: <span className="text-amber-600">{getAnxietyLabel(anxiety)}</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={anxiety}
                onChange={(e) => setAnxiety(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Thought Tags */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-lg font-medium text-gray-800 mb-4">
              What's your vibe right now?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {THOUGHT_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setThoughtTag(tag.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all ${
                    thoughtTag === tag.id
                      ? 'bg-amber-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{tag.emoji}</span>
                  <span className="font-medium">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Affirmation category="checkin" />
      )}

      <button
        onClick={handleContinue}
        disabled={!thoughtTag}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {showAffirmation ? 'Continue →' : 'Check In'}
      </button>
    </div>
  )
}
