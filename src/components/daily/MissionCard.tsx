'use client'

import type { TrackMission, Track } from '@/lib/types'
import { BRAND } from '@/lib/brand'

interface Props {
  mission: TrackMission
  track: Track
  dayNumber: number
  onContinue: () => void
  onShuffle?: () => void
  isCreativeMode?: boolean
}

export default function MissionCard({ mission, track, dayNumber, onContinue, onShuffle, isCreativeMode = false }: Props) {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-emerald-100 text-emerald-700'
    if (difficulty === 2) return 'bg-amber-100 text-amber-700'
    return 'bg-purple-100 text-purple-700'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return '🌱 Gentle'
    if (difficulty === 2) return '💪 Moderate'
    return '🔥 Brave'
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{track?.icon || '🎙️'}</span>
          <span className="text-slate-500 font-medium">Day {dayNumber}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mission?.difficulty || 1)}`}>
          {getDifficultyLabel(mission?.difficulty || 1)}
        </span>
      </div>

      {/* Mission Title */}
      <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND.colors.deepPurple }}>
        {mission?.title || 'Today\'s Mission'}
      </h2>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Your Action
        </h3>
        <p className="text-lg text-slate-700 leading-relaxed">
          {mission?.instructions || 'Complete today\'s challenge.'}
        </p>
      </div>
      
      {/* Why It Works */}
      {mission?.why_it_works && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
          <p className="text-sm font-medium mb-1" style={{ color: BRAND.colors.gold }}>💡 Why this works</p>
          <p className="text-amber-800 text-sm">{mission.why_it_works}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Track Progress</span>
          <span>{dayNumber} of 21 days</span>
        </div>
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${(dayNumber / 21) * 100}%`,
              background: BRAND.gradients.button 
            }}
          />
        </div>
      </div>

      {/* Shuffle Button */}
      {onShuffle && (
        <button
          onClick={onShuffle}
          className="w-full mb-3 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <span>🔀</span>
          <span>Try a different mission</span>
        </button>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
        style={{ background: BRAND.gradients.button }}
      >
        {isCreativeMode ? 'Get my creative prompt →' : 'Get my platform prompt →'}
      </button>
    </div>
  )
}
