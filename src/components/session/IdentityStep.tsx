'use client'

import { useState } from 'react'
import { IDENTITY_OPTIONS, STEP_MICROCOPY } from '@/lib/session-types'

interface Props {
  initialChoice?: 'impressive' | 'useful'
  onComplete: (choice: 'impressive' | 'useful') => void
}

export default function IdentityStep({ initialChoice, onComplete }: Props) {
  const [choice, setChoice] = useState<'impressive' | 'useful' | undefined>(initialChoice)
  const [showReframe, setShowReframe] = useState(!!initialChoice)

  const handleSelect = (selected: 'impressive' | 'useful') => {
    setChoice(selected)
    setShowReframe(true)
  }

  const handleContinue = () => {
    if (choice) {
      onComplete(choice)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Identity Reframe</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.identity}</p>
      </div>

      {!showReframe ? (
        <div className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            When you think about showing up online, what feels more true right now?
          </p>

          <div className="grid gap-4">
            <button
              onClick={() => handleSelect('impressive')}
              className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">✨</span>
                <span className="text-xl font-semibold text-gray-800">
                  {IDENTITY_OPTIONS.impressive.title}
                </span>
              </div>
              <p className="text-gray-600">{IDENTITY_OPTIONS.impressive.description}</p>
            </button>

            <button
              onClick={() => handleSelect('useful')}
              className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🛠️</span>
                <span className="text-xl font-semibold text-gray-800">
                  {IDENTITY_OPTIONS.useful.title}
                </span>
              </div>
              <p className="text-gray-600">{IDENTITY_OPTIONS.useful.description}</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{choice === 'impressive' ? '✨' : '🛠️'}</span>
              <span className="text-lg font-semibold text-gray-800">
                {choice && IDENTITY_OPTIONS[choice].title}
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-5">
              <p className="font-accent text-xl text-amber-900 italic text-center leading-relaxed">
                "{choice && IDENTITY_OPTIONS[choice].reframe}"
              </p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-amber-800 text-sm text-center">
              {choice === 'impressive' 
                ? "It's okay to want recognition. Just don't let it be the only reason you show up."
                : "Focus on who you're helping, and the rest tends to follow."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowReframe(false)}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              ← Reconsider
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
