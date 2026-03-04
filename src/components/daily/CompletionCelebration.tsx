'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  streak: number
  dayNumber: number
  longestStreak: number
  isCreativeMode?: boolean
  otherModeAvailable?: boolean
  isBonusRound?: boolean  // True when completing the second mode
  onStartOtherMode?: () => void
}

export default function CompletionCelebration({ 
  streak, 
  dayNumber, 
  longestStreak, 
  isCreativeMode = false,
  otherModeAvailable = false,
  isBonusRound = false,
  onStartOtherMode,
}: Props) {
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setConfetti(true)
    const timer = setTimeout(() => setConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const getStreakMessage = () => {
    // Bonus round message
    if (isBonusRound) {
      return "DOUBLE DAY! You crushed both modes! 🔥🔥"
    }
    if (isCreativeMode) {
      if (streak >= 21) return "21 days of creative exploration! You're an artist. 🎨"
      if (streak >= 14) return "Two weeks of creative practice! Your voice is evolving."
      if (streak >= 7) return "One week of discovery! The creative habit is forming."
      if (streak >= 3) return "Three days exploring! Keep playing."
      if (streak === 1) return "First creative session complete! Discovery begins here."
      return `${streak} days of creative practice!`
    }
    if (streak >= 21) return "You've completed the entire track! 🏆"
    if (streak >= 14) return "Two weeks strong! You're unstoppable!"
    if (streak >= 7) return "One week down! The habit is forming!"
    if (streak >= 3) return "Three days in a row! Keep building!"
    if (streak === 1) return "Day one complete! Every journey starts here."
    return `${streak} days! You're building momentum!`
  }

  return (
    <div className={`rounded-3xl shadow-xl p-8 border relative overflow-hidden ${
      isBonusRound 
        ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200' 
        : 'bg-white border-slate-100'
    }`}>
      {/* Confetti Animation */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '💪', '🦁'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Trophy */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-slow ${
          isBonusRound 
            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-200' 
            : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200'
        }`}>
          <span className="text-5xl">{isBonusRound ? '⭐' : '🦁'}</span>
        </div>

        {/* Bonus Badge */}
        {isBonusRound && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
            <span className="text-lg">🏆</span>
            <span className="font-bold">BONUS COMPLETE!</span>
            <span className="text-lg">🏆</span>
          </div>
        )}

        {/* Main Message */}
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {isBonusRound ? 'Double Day Champion!' : 'You did it!'}
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          {getStreakMessage()}
        </p>

        {/* Stats */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-8">
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                {streak}
              </div>
              <div className="text-sm text-slate-500 mt-1">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                {longestStreak}
              </div>
              <div className="text-sm text-slate-500 mt-1">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Next Day Preview */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
          <p className="text-rose-700 text-sm">
            <span className="font-semibold">Tomorrow:</span> Day {dayNumber >= 21 ? 1 : dayNumber + 1} mission unlocked
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {otherModeAvailable && onStartOtherMode && (
            <button
              onClick={onStartOtherMode}
              className={`w-full py-4 px-6 font-semibold rounded-xl transition-all shadow-lg ${
                isCreativeMode
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-slate-200'
                  : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-orange-200'
              }`}
            >
              {isCreativeMode ? '📋 Try Structured Mode Too' : '🎨 Try Creative Mode Too'}
            </button>
          )}
          <Link
            href="/lounge"
            className="block w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-200"
          >
            Share in The Lounge 🎤
          </Link>
          <Link
            href="/progress"
            className="block w-full py-3 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all"
          >
            View My Progress
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 2s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
