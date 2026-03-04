'use client'

import type { Mood } from '@/lib/types'

type Mode = 'structured' | 'creative'

interface Props {
  moods: Mood[]
  onSelect: (mood: Mood) => void
  mode: Mode
  onModeChange: (mode: Mode) => void
  structuredDone: boolean
  creativeDone: boolean
}

export default function MoodCheckIn({ 
  moods, 
  onSelect, 
  mode, 
  onModeChange,
  structuredDone,
  creativeDone,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
      {/* Mode Toggle at Top */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-slate-100 rounded-full p-1">
          <button
            onClick={() => onModeChange('structured')}
            disabled={structuredDone}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              structuredDone
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                : mode === 'structured'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {structuredDone && <span>✓</span>}
            📋 Structured
          </button>
          <button
            onClick={() => onModeChange('creative')}
            disabled={creativeDone}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              creativeDone
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                : mode === 'creative'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {creativeDone && <span>✓</span>}
            🎨 Creative
          </button>
        </div>
      </div>

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
