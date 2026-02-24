'use client'

import { useState } from 'react'
import { STEP_MICROCOPY } from '@/lib/session-types'

interface Props {
  selectedAction?: string
  initialNote?: string
  onComplete: (note: string) => void
}

const REFLECTION_PROMPTS = [
  "What surprised you about today's session?",
  "What felt harder than expected?",
  "What felt easier than expected?",
  "What would you tell yourself before tomorrow's session?",
  "What did you learn about yourself?",
]

export default function ReflectionStep({ selectedAction, initialNote, onComplete }: Props) {
  const [note, setNote] = useState(initialNote || '')
  const [promptIndex] = useState(() => Math.floor(Math.random() * REFLECTION_PROMPTS.length))

  const handleComplete = () => {
    onComplete(note)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Reflect</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.reflection}</p>
      </div>

      {/* Today's action reminder */}
      {selectedAction && (
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-xl">✓</span>
            <div>
              <p className="text-sm font-medium">Today's action:</p>
              <p className="text-sm">{selectedAction}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600 mb-4 text-center italic">
          "{REFLECTION_PROMPTS[promptIndex]}"
        </p>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Take a moment to reflect..."
          className="w-full h-32 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none resize-none text-gray-800"
        />
      </div>

      <div className="bg-amber-50 rounded-xl p-4">
        <p className="text-amber-800 text-sm text-center">
          Reflection isn't required, but it helps your brain consolidate the learning.
        </p>
      </div>

      <button
        onClick={handleComplete}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
      >
        {note.trim() ? 'Save & Continue →' : 'Skip Reflection →'}
      </button>
    </div>
  )
}
