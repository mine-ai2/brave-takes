'use client'

import { useState } from 'react'

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
  
  // Get affirmation based on value
  const getAffirmation = (val: number) => {
    if (val < 20) return "Low energy is not low worth. Small steps still count."
    if (val < 40) return "Even tired, you showed up. That's the win."
    if (val < 60) return "Steady is sustainable. Keep building."
    if (val < 80) return "That good energy? Channel it into your voice."
    return "That fire is fuel. Use it before it fades!"
  }
  
  // Get gradient color based on value
  const getGradientPosition = () => {
    return `${value}%`
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
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
        <div className="relative h-3 rounded-full bg-gradient-to-r from-slate-200 via-amber-200 to-orange-400 mb-4">
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
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-rose-400 transition-all duration-150 pointer-events-none"
            style={{ left: `calc(${value}% - 16px)` }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-sm text-slate-400">
          <span>😔 Low</span>
          <span>🔥 High</span>
        </div>
      </div>

      {/* Affirmation Preview */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-4 mb-6 border border-rose-100">
        <p className="text-slate-600 text-center italic">
          "{getAffirmation(value)}"
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onContinue(value, getLabel(value))}
        className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-200"
      >
        Continue →
      </button>

      <p className="text-center text-slate-400 text-xs mt-4">
        Every feeling is valid. Start where you are.
      </p>
    </div>
  )
}
