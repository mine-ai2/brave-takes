'use client'

import type { CreativePrompt } from '@/lib/types'

interface Props {
  prompt: CreativePrompt
  categoryLabel: string
  onComplete: () => void
  onShuffle: () => void
  saving: boolean
}

export default function CreativePromptCard({ prompt, categoryLabel, onComplete, onShuffle, saving }: Props) {
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      tone: 'from-violet-500 to-purple-500',
      character: 'from-emerald-500 to-teal-500',
      cinematic: 'from-amber-500 to-orange-500',
      trending: 'from-pink-500 to-rose-500',
      experimental: 'from-indigo-500 to-blue-500',
      craft: 'from-slate-600 to-slate-700',
    }
    return gradients[category] || gradients.craft
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      tone: '🎭',
      character: '🎬',
      cinematic: '🎥',
      trending: '📈',
      experimental: '🧪',
      craft: '🔧',
    }
    return icons[category] || '✨'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return { label: 'Warm-up', color: 'bg-emerald-100 text-emerald-700' }
    if (difficulty === 2) return { label: 'Practice', color: 'bg-amber-100 text-amber-700' }
    return { label: 'Challenge', color: 'bg-rose-100 text-rose-700' }
  }

  const difficulty = getDifficultyLabel(prompt.difficulty)

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      {/* Category Header */}
      <div className={`bg-gradient-to-r ${getCategoryGradient(prompt.category)} rounded-2xl p-4 mb-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(prompt.category)}</span>
            <span className="font-medium">{categoryLabel}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
            {difficulty.label}
          </span>
        </div>
      </div>

      {/* Prompt Title */}
      <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">
        {prompt.title}
      </h2>

      {/* Prompt Text */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
        <p className="text-slate-700 leading-relaxed text-lg">
          {prompt.prompt_text}
        </p>
      </div>

      {/* Example/Tip */}
      {prompt.example && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-slate-500 font-medium mb-1">💡 Tip</p>
          <p className="text-slate-600 text-sm italic">{prompt.example}</p>
        </div>
      )}

      {/* Encouragement */}
      <div className="text-center mb-6">
        <p className="text-slate-500 text-sm font-serif italic">
          "There are no mistakes, only discoveries."
        </p>
      </div>

      {/* Action Buttons */}
      <button
        onClick={onComplete}
        disabled={saving}
        className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : (
          <span>✨ I explored this</span>
        )}
      </button>

      <div className="flex gap-3">
        <button
          onClick={onShuffle}
          disabled={saving}
          className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all disabled:opacity-50"
        >
          🎲 Different prompt
        </button>
        <button
          onClick={onComplete}
          disabled={saving}
          className="flex-1 py-3 px-4 border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-all disabled:opacity-50"
        >
          Skip for today
        </button>
      </div>
    </div>
  )
}
