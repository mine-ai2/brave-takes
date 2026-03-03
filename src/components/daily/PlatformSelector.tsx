'use client'

import type { Platform } from '@/lib/types'

interface Props {
  platforms: Platform[]
  onSelect: (platform: Platform) => void
}

export default function PlatformSelector({ platforms, onSelect }: Props) {
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

  const getPlatformBg = (color: string) => {
    const bgs: Record<string, string> = {
      pink: 'bg-pink-50 border-pink-200 hover:border-pink-400',
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      red: 'bg-red-50 border-red-200 hover:border-red-400',
      gray: 'bg-slate-50 border-slate-200 hover:border-slate-400',
      teal: 'bg-teal-50 border-teal-200 hover:border-teal-400',
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
    }
    return bgs[color] || bgs.pink
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Where are you posting today?
        </h2>
        <p className="text-slate-500">
          Pick your platform and get a tailored prompt
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelect(platform)}
            className={`p-4 rounded-2xl border-2 transition-all ${getPlatformBg(platform.color)}`}
          >
            <div className="text-center">
              <span className="text-3xl block mb-2">{platform.icon}</span>
              <span className="text-sm font-medium text-slate-700">
                {platform.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-slate-400 text-sm">
        Your prompt will be customized for this platform
      </p>
    </div>
  )
}
