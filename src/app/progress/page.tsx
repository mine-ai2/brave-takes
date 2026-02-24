import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import WinsClient from './WinsClient'
import { GOAL_CATEGORIES } from '@/lib/session-types'

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

  // Get V2 session states
  const { data: sessions } = await supabase
    .from('session_states')
    .select('*')
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)
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

  // V2 session stats
  const completedSessions = sessions?.length || 0
  const avgBoldness = sessions?.length 
    ? Math.round((sessions.reduce((acc, s) => acc + (s.boldness_level || 0), 0) / sessions.length) * 10) / 10
    : 0
  const avgAnxiety = sessions?.length
    ? Math.round((sessions.reduce((acc, s) => acc + (s.anxiety_level || 0), 0) / sessions.length) * 10) / 10
    : 0

  // Goal category breakdown
  const goalCounts: Record<string, number> = {}
  sessions?.forEach(s => {
    if (s.goal_category) {
      goalCounts[s.goal_category] = (goalCounts[s.goal_category] || 0) + 1
    }
  })

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

        {/* V2 Session Stats */}
        {completedSessions > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Insights</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{completedSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{avgBoldness}</div>
                <div className="text-xs text-gray-500">Avg Boldness</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{avgAnxiety}</div>
                <div className="text-xs text-gray-500">Avg Anxiety</div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Category Breakdown */}
        {Object.keys(goalCounts).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Goals by Type</h2>
            <div className="space-y-3">
              {GOAL_CATEGORIES.map((cat) => {
                const count = goalCounts[cat.id] || 0
                if (count === 0) return null
                const percentage = Math.round((count / completedSessions) * 100)
                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{cat.label}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rep Breakdown</h2>
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
