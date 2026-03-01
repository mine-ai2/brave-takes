'use client'

import type { TrackMission, Track } from '@/lib/types'

interface Props {
  mission: TrackMission
  track: Track
  dayNumber: number
  onContinue: () => void
}

export default function MissionCard({ mission, track, dayNumber, onContinue }: Props) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      case 'brave':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🌱 Gentle'
      case 'medium':
        return '💪 Moderate'
      case 'brave':
        return '🔥 Brave'
      default:
        return difficulty
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{track?.icon || '📍'}</span>
          <span className="text-slate-500 font-medium">Day {dayNumber}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mission?.difficulty || 'easy')}`}>
          {getDifficultyLabel(mission?.difficulty || 'easy')}
        </span>
      </div>

      {/* Mission Title */}
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {mission?.title || 'Today\'s Mission'}
      </h2>
      
      {/* Description */}
      {mission?.description && (
        <p className="text-slate-500 mb-6">
          {mission.description}
        </p>
      )}

      {/* Action Prompt */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Your Action
        </h3>
        <p className="text-lg text-slate-700 leading-relaxed">
          {mission?.action_prompt || 'Complete today\'s challenge.'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Track Progress</span>
          <span>{dayNumber} of 21 days</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all"
            style={{ width: `${(dayNumber / 21) * 100}%` }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-200"
      >
        Get my platform prompt →
      </button>
    </div>
  )
}
