import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import WinsClient from './WinsClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all completions
  const { data: completions } = await supabase
    .from('rep_completions')
    .select('*')
    .eq('user_id', user.id)
    .order('date_local', { ascending: false })

  // Get all wins
  const { data: wins } = await supabase
    .from('wins')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const totalReps = completions?.filter(c => c.status === 'done' || c.status === 'easier_done').length || 0
  const totalDone = completions?.filter(c => c.status === 'done').length || 0
  const totalEasier = completions?.filter(c => c.status === 'easier_done').length || 0

  // Calculate current streak
  let streak = 0
  if (completions && completions.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    const dates = completions.map(c => c.date_local).sort().reverse()
    let checkDate = new Date(today)
    
    for (const dateStr of dates) {
      const compDate = new Date(dateStr)
      const diff = Math.floor((checkDate.getTime() - compDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diff <= 1) {
        streak++
        checkDate = compDate
      } else {
        break
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-amber-900">Your Progress</h1>
          <p className="text-amber-700 mt-1">Look how far you&apos;ve come!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-amber-600">{totalReps}</div>
            <div className="text-sm text-gray-600 mt-1">Total Reps</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-500">{streak}</div>
            <div className="text-sm text-gray-600 mt-1">Day Streak 🔥</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Full reps completed</span>
              <span className="font-semibold text-green-600">{totalDone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Easier versions</span>
              <span className="font-semibold text-amber-600">{totalEasier}</span>
            </div>
          </div>
        </div>

        {/* Wins Log */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Wins 🏆</h2>
          
          <WinsClient userId={user.id} initialWins={wins || []} />
        </div>
      </div>

      <Navigation current="progress" />
    </div>
  )
}
