'use client'

import { useState } from 'react'
import { BRAND } from '@/lib/brand'
import type { Mood } from '@/lib/types'

interface Props {
  moods: Mood[]
  currentStreak: number
  displayName: string | null
}

export default function AffirmationsClient({ moods, currentStreak, displayName }: Props) {
  // Get all affirmations from moods
  const affirmations = moods.map(m => ({
    text: m.affirmation,
    mood: m.name,
    emoji: m.emoji
  }))

  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * affirmations.length)
  )
  const [isAnimating, setIsAnimating] = useState(false)

  const currentAffirmation = affirmations[currentIndex]

  const handleNewAffirmation = () => {
    setIsAnimating(true)
    setTimeout(() => {
      let newIndex = Math.floor(Math.random() * affirmations.length)
      // Make sure we get a different one
      while (newIndex === currentIndex && affirmations.length > 1) {
        newIndex = Math.floor(Math.random() * affirmations.length)
      }
      setCurrentIndex(newIndex)
      setIsAnimating(false)
    }, 200)
  }

  const firstName = displayName?.split(' ')[0] || 'Friend'

  return (
    <div 
      className="min-h-screen pb-24"
      style={{
        background: 'linear-gradient(180deg, #faf8ff 0%, #f5f0ff 30%, #efe6ff 60%, #e8dcff 100%)'
      }}
    >
      <div className="max-w-md mx-auto px-6 pt-12">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a2c7a' }}>
            Welcome back, <span style={{ color: BRAND.colors.gold }}>{firstName}</span> 👋
          </h1>
          
          {currentStreak > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold" style={{ color: '#4a2c7a' }}>
                {currentStreak} Day
              </span>
              <span className="text-lg text-slate-600">Brave Streak</span>
            </div>
          )}
          {currentStreak > 0 && (
            <p className="text-slate-500 text-sm mt-1">Momentum looks good on you.</p>
          )}
        </div>

        {/* Daily Affirmation Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100 mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#4a2c7a' }}>
            Daily Affirmation
          </h2>
          
          <div 
            className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          >
            <p 
              className="text-xl leading-relaxed mb-6 font-medium"
              style={{ color: '#3d1c6b' }}
            >
              "{currentAffirmation?.text}"
            </p>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <span>{currentAffirmation?.emoji}</span>
              <span>{currentAffirmation?.mood}</span>
            </div>
          </div>

          <button
            onClick={handleNewAffirmation}
            className="w-full py-3 px-6 rounded-full font-medium transition-all hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)',
              color: '#92400e',
              border: '1px solid #fcd34d'
            }}
          >
            ✨ New Affirmation
          </button>
        </div>

      </div>
    </div>
  )
}
