'use client'

import { useState, useEffect } from 'react'
import type { Mood } from '@/lib/types'

interface Props {
  mood: Mood
  affirmation: string
  onContinue: () => void
}

export default function AffirmationDisplay({ mood, affirmation, onContinue }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in after mount
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Mood Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-8">
          <span className="text-xl">{mood.emoji}</span>
          <span className="text-slate-600 font-medium">Feeling {mood.name.toLowerCase()}</span>
        </div>

        {/* Affirmation */}
        <div className="mb-10">
          <blockquote className="text-2xl font-serif text-slate-800 leading-relaxed italic">
            &ldquo;{affirmation}&rdquo;
          </blockquote>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-200"
        >
          I&apos;m ready for my mission →
        </button>
      </div>

      <p className="text-center text-slate-400 text-sm mt-6">
        Take a breath. You&apos;ve got this.
      </p>
    </div>
  )
}
