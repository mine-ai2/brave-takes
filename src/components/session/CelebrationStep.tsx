'use client'

import { useEffect, useState } from 'react'
import Affirmation from './Affirmation'
import { STEP_MICROCOPY } from '@/lib/session-types'

interface Props {
  streak: number
  dayNumber: number
  onComplete: () => void
}

const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
}

export default function CelebrationStep({ streak, dayNumber, onComplete }: Props) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Generate confetti
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 2,
        rotation: Math.random() * 360,
      })
    }
    setConfetti(pieces)

    // Show content after confetti starts
    setTimeout(() => setShowContent(true), 500)
  }, [])

  const getTomorrowTease = () => {
    const teases = [
      "Tomorrow, we go again. Same time, same courage.",
      "Rest up. Tomorrow's rep is waiting for you.",
      "You showed up today. That's the hardest part. See you tomorrow.",
      "One day closer to the creator you're becoming.",
      "The compound effect of daily bravery is real. See you tomorrow.",
    ]
    return teases[Math.floor(Math.random() * teases.length)]
  }

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}

      {showContent && (
        <>
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-amber-900 mb-2">You Did It!</h2>
            <p className="text-amber-700 text-lg">{STEP_MICROCOPY.celebration}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-amber-600">{dayNumber}</p>
              <p className="text-gray-600 text-sm">Day of Journey</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-orange-500">🔥 {streak}</p>
              <p className="text-gray-600 text-sm">Day Streak</p>
            </div>
          </div>

          {/* Completion Affirmation */}
          <Affirmation category="complete" />

          {/* Tomorrow Tease */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6">
            <p className="text-amber-800 text-center font-medium">
              {getTomorrowTease()}
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Done for Today ✓
          </button>
        </>
      )}
    </div>
  )
}
