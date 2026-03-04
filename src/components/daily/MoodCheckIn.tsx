'use client'

import type { Mood } from '@/lib/types'

interface Props {
  moods: Mood[]
  onSelect: (mood: Mood) => void
}

export default function MoodCheckIn({ 
  moods, 
  onSelect, 
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          How are you feeling?
        </h2>
        <p className="text-slate-500 text-sm">
          Check in before we begin
        </p>
      </div>

      {/* 3x2 Grid for 6 moods */}
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood)}
            className="group p-4 rounded-2xl border-2 border-slate-100 hover:border-rose-200 bg-gradient-to-br from-white to-slate-50 hover:from-rose-50 hover:to-orange-50 transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-3xl block mb-1 group-hover:scale-110 transition-transform">
              {mood.emoji}
            </span>
            <span className="font-medium text-slate-700 text-sm block">
              {mood.name}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-slate-400 text-xs mt-6">
        Every feeling is valid. Start where you are.
      </p>
    </div>
  )
}
