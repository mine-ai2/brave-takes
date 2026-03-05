'use client'

import { useState, useEffect } from 'react'
import type { Mood } from '@/lib/types'
import { BRAND } from '@/lib/brand'

interface Props {
  mood?: Mood | null
  emotionLabel?: string
  affirmation: string
  onContinue: () => void
}

export default function AffirmationDisplay({ mood, emotionLabel, affirmation, onContinue }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in after mount
    setTimeout(() => setVisible(true), 100)
  }, [])

  // Get display emoji based on emotion label
  const getEmoji = () => {
    if (mood) return mood.emoji
    if (!emotionLabel) return '✨'
    if (emotionLabel.includes('Low')) return '😔'
    if (emotionLabel.includes('Tired')) return '😐'
    if (emotionLabel.includes('Steady')) return '🙂'
    if (emotionLabel.includes('Good')) return '😊'
    return '🔥'
  }

  const getDisplayLabel = () => {
    if (mood) return `Feeling ${mood.name.toLowerCase()}`
    if (emotionLabel) return emotionLabel
    return 'Checking in'
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
      <div className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Mood Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-8">
          <span className="text-xl">{getEmoji()}</span>
          <span className="font-medium" style={{ color: BRAND.colors.deepPurple }}>{getDisplayLabel()}</span>
        </div>

        {/* Affirmation */}
        <div className="mb-10">
          <blockquote className="text-2xl font-serif leading-relaxed italic" style={{ color: BRAND.colors.deepPurple }}>
            &ldquo;{affirmation}&rdquo;
          </blockquote>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          style={{ background: BRAND.gradients.button }}
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
