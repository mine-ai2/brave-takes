'use client'

import { useState } from 'react'
import { AffirmationCategory, getRandomAffirmation, shuffleAffirmation } from '@/lib/affirmations'

interface Props {
  category: AffirmationCategory
  className?: string
}

export default function Affirmation({ category, className = '' }: Props) {
  const [affirmation, setAffirmation] = useState(() => getRandomAffirmation(category))

  const handleShuffle = () => {
    setAffirmation(shuffleAffirmation(category, affirmation))
  }

  return (
    <div className={`bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 ${className}`}>
      <p className="font-accent text-xl md:text-2xl text-amber-900 italic text-center leading-relaxed">
        "{affirmation}"
      </p>
      <button
        onClick={handleShuffle}
        className="mt-4 mx-auto block text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
        aria-label="Shuffle affirmation"
      >
        🔀 Shuffle
      </button>
    </div>
  )
}
