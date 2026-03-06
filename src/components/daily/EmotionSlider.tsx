'use client'

import { useState } from 'react'
import { BRAND } from '@/lib/brand'

interface Props {
  onContinue: (value: number, label: string) => void
}

export default function EmotionSlider({ onContinue }: Props) {
  const [value, setValue] = useState(50)
  
  // Get emoji based on value
  const getEmoji = (val: number) => {
    if (val < 20) return '😔'
    if (val < 40) return '😐'
    if (val < 60) return '🙂'
    if (val < 80) return '😊'
    return '🔥'
  }
  
  // Get label based on value
  const getLabel = (val: number) => {
    if (val < 20) return 'Low Energy'
    if (val < 40) return 'A Bit Tired'
    if (val < 60) return 'Steady'
    if (val < 80) return 'Feeling Good'
    return 'On Fire!'
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND.colors.deepPurple }}>
          How are you feeling?
        </h2>
        <p className="text-slate-500 text-sm">
          Slide to check in before we begin
        </p>
      </div>

      {/* Big Emoji Display */}
      <div className="text-center mb-6">
        <span className="text-7xl block mb-2 transition-all duration-300">
          {getEmoji(value)}
        </span>
        <span className="text-xl font-semibold text-slate-700">
          {getLabel(value)}
        </span>
      </div>

      {/* Slider Container */}
      <div className="px-4 mb-8">
        {/* Slider Track Background */}
        <div className="relative h-3 rounded-full mb-4"
             style={{ background: `linear-gradient(to right, ${BRAND.colors.lavender}, ${BRAND.colors.magenta}, ${BRAND.colors.gold})` }}>
          {/* Custom Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Slider Thumb Visual */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-150 pointer-events-none"
            style={{ 
              left: `calc(${value}% - 16px)`,
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: BRAND.colors.deepPurple,
            }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-sm text-slate-400">
          <span>😔 Low</span>
          <span>🔥 High</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onContinue(value, getLabel(value))}
        className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
        style={{ background: BRAND.gradients.button }}
      >
        Continue →
      </button>

      <p className="text-center text-slate-400 text-xs mt-4">
        Just a quick vibe check. No wrong answers!
      </p>
    </div>
  )
}
