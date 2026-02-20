'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Rep, RepCompletion, Checkin } from '@/lib/types'
import Navigation from '@/components/Navigation'

interface Props {
  rep: Rep | null
  dayNumber: number
  completion: RepCompletion | null
  checkin: Checkin | null
  streak: number
  todayLocal: string
  userId: string
}

const THOUGHT_TAGS = [
  'Excited',
  'Nervous',
  'Procrastinating',
  'Determined',
  'Doubtful',
  'Ready',
]

export default function TodayClient({
  rep,
  dayNumber,
  completion: initialCompletion,
  checkin: initialCheckin,
  streak,
  todayLocal,
  userId,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [completion, setCompletion] = useState(initialCompletion)
  const [checkin, setCheckin] = useState(initialCheckin)
  const [anxiety, setAnxiety] = useState(initialCheckin?.anxiety_before || 5)
  const [thoughtTag, setThoughtTag] = useState(initialCheckin?.thought_tag || '')
  const [showCheckin, setShowCheckin] = useState(!initialCheckin)
  const [loading, setLoading] = useState(false)

  const handleCheckin = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('checkins')
      .upsert({
        user_id: userId,
        date_local: todayLocal,
        anxiety_before: anxiety,
        thought_tag: thoughtTag,
      })
      .select()
      .single()

    if (!error && data) {
      setCheckin(data)
      setShowCheckin(false)
    }
    setLoading(false)
  }

  const handleComplete = async (status: 'done' | 'easier_done' | 'skipped') => {
    if (!rep) return
    setLoading(true)

    const { data, error } = await supabase
      .from('rep_completions')
      .upsert({
        user_id: userId,
        rep_id: rep.id,
        date_local: todayLocal,
        status,
      })
      .select()
      .single()

    if (!error && data) {
      setCompletion(data)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <p className="text-amber-600 font-medium">Day {dayNumber} of 14</p>
          <h1 className="text-2xl font-bold text-amber-900 mt-1">
            {rep?.title || 'Rest Day'}
          </h1>
          {streak > 0 && (
            <p className="text-orange-500 mt-2">🔥 {streak} day streak!</p>
          )}
        </div>

        {/* Check-in Card */}
        {showCheckin && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              How are you feeling?
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                Anxiety level: {anxiety}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxiety}
                onChange={(e) => setAnxiety(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Calm</span>
                <span>Anxious</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                What&apos;s your vibe?
              </label>
              <div className="flex flex-wrap gap-2">
                {THOUGHT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setThoughtTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      thoughtTag === tag
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckin}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Check In'}
            </button>
          </div>
        )}

        {/* Today's Rep Card */}
        {rep && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Today&apos;s Rep
            </h2>
            
            <div className="bg-amber-50 rounded-xl p-4 mb-4">
              <p className="text-gray-800">{rep.rep_main}</p>
            </div>

            {rep.rep_easier && (
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Easier version:</span> {rep.rep_easier}
              </div>
            )}

            {completion ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">
                  {completion.status === 'done' && '✅'}
                  {completion.status === 'easier_done' && '👍'}
                  {completion.status === 'skipped' && '⏭️'}
                </div>
                <p className="text-gray-600">
                  {completion.status === 'done' && 'Completed!'}
                  {completion.status === 'easier_done' && 'Completed (easier version)'}
                  {completion.status === 'skipped' && 'Skipped for today'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleComplete('done')}
                  disabled={loading || showCheckin}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  ✓ Done!
                </button>
                <button
                  onClick={() => handleComplete('easier_done')}
                  disabled={loading || showCheckin}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Did the easier version
                </button>
                <button
                  onClick={() => handleComplete('skipped')}
                  disabled={loading || showCheckin}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Skip today
                </button>
              </div>
            )}
          </div>
        )}

        {/* Motivation */}
        <div className="text-center text-amber-700 text-sm">
          <p>Every rep builds your bravery muscle. 💪</p>
        </div>
      </div>

      <Navigation current="today" />
    </div>
  )
}
