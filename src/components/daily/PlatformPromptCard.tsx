'use client'

import type { PlatformPrompt, Platform } from '@/lib/types'

interface Props {
  prompt: PlatformPrompt
  platform: Platform
  onComplete: () => void
  onShuffle: () => void
  saving: boolean
}

export default function PlatformPromptCard({ prompt, platform, onComplete, onShuffle, saving }: Props) {
  const getPlatformGradient = (color: string) => {
    const gradients: Record<string, string> = {
      pink: 'from-pink-500 to-rose-500',
      blue: 'from-blue-500 to-indigo-500',
      red: 'from-red-500 to-orange-500',
      gray: 'from-slate-600 to-slate-700',
      teal: 'from-teal-500 to-cyan-500',
      indigo: 'from-indigo-500 to-purple-500',
    }
    return gradients[color] || gradients.pink
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      {/* Platform Header */}
      <div className={`bg-gradient-to-r ${getPlatformGradient(platform.color)} rounded-2xl p-4 mb-6 text-white text-center`}>
        <span className="text-3xl block mb-2">{platform.icon}</span>
        <h3 className="font-semibold">{platform.name}</h3>
      </div>

      {/* Prompt Title */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">
        {prompt.title}
      </h2>

      {/* Prompt Text */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-4">
        <p className="text-slate-700 leading-relaxed">
          {prompt.prompt_text}
        </p>
      </div>

      {/* Shuffle Button */}
      <button
        onClick={onShuffle}
        className="w-full mb-6 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <span>🔀</span>
        <span>Try a different prompt</span>
      </button>

      {/* Example */}
      {prompt.example && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-600 font-medium mb-1">💡 Tip</p>
          <p className="text-amber-800 text-sm">{prompt.example}</p>
        </div>
      )}

      {/* Encouragement */}
      <div className="text-center mb-6">
        <p className="text-slate-500 text-sm">
          Remember: Done is better than perfect. Post it imperfectly.
        </p>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={saving}
        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span>✅ I did it!</span>
        )}
      </button>

      <button
        onClick={onComplete}
        disabled={saving}
        className="w-full mt-3 py-3 px-4 border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-all disabled:opacity-50"
      >
        Skip for today
      </button>
    </div>
  )
}
