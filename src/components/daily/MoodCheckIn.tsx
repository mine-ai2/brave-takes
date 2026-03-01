'use client'

import type { Mood } from '@/lib/types'

interface Props {
  moods: Mood[]
  onSelect: (mood: Mood) => void
}

export default function MoodCheckIn({ moods, onSelect }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          How are you feeling?
        </h2>
        <p className="text-slate-500">
          Check in with yourself before we begin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood)}
            className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
              {mood.emoji}
            </span>
            <span className="font-medium text-slate-700 block">
              {mood.name}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-slate-400 text-sm mt-8">
        Every feeling is valid. Start where you are.
      </p>
    </div>
  )
}
