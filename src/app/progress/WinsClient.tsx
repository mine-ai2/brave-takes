'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Win } from '@/lib/types'

interface Props {
  userId: string
  initialWins: Win[]
}

export default function WinsClient({ userId, initialWins }: Props) {
  const supabase = createClient()
  const [wins, setWins] = useState(initialWins)
  const [newWin, setNewWin] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddWin = async () => {
    if (!newWin.trim()) return
    setLoading(true)

    const todayLocal = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('wins')
      .insert({
        user_id: userId,
        date_local: todayLocal,
        text: newWin.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setWins([data, ...wins])
      setNewWin('')
    }
    setLoading(false)
  }

  return (
    <div>
      {/* Add win form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          placeholder="Log a win..."
          className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none"
        />
        <button
          onClick={handleAddWin}
          disabled={loading || !newWin.trim()}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Wins list */}
      {wins.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No wins logged yet. Celebrate your victories!
        </p>
      ) : (
        <div className="space-y-3">
          {wins.map((win) => (
            <div key={win.id} className="bg-amber-50 rounded-xl p-4">
              <p className="text-gray-800">{win.text}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(win.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
