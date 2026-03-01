'use client'

import type { Profile, Track, DailyCompletion, Mood } from '@/lib/types'

interface Props {
  profile: Profile
  track: Track | null
  completions: DailyCompletion[]
  currentStreak: number
  longestStreak: number
  moods: Mood[]
}

export default function ProgressClient({
  profile,
  track,
  completions,
  currentStreak,
  longestStreak,
  moods,
}: Props) {
  // Calculate stats
  const totalCompletions = completions.filter(c => c.completed_at).length
  
  // Mood distribution
  const moodCounts = completions.reduce((acc, c) => {
    if (c.mood_id) {
      acc[c.mood_id] = (acc[c.mood_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Get most common mood
  const mostCommonMoodId = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const mostCommonMood = moods.find(m => m.id === mostCommonMoodId)

  // Calculate completion rate (last 7 days)
  const last7Days = completions.slice(0, 7)
  const completedLast7 = last7Days.filter(c => c.completed_at).length
  const completionRate = last7Days.length > 0 ? Math.round((completedLast7 / 7) * 100) : 0

  // Generate calendar data for last 21 days
  const calendarDays = []
  const today = new Date()
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const completion = completions.find(c => c.date_local === dateStr)
    calendarDays.push({
      date: dateStr,
      completed: !!completion?.completed_at,
      isToday: i === 0,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Progress</h1>
          <p className="text-slate-500">Keep showing up, brave creator</p>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-orange-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm mb-1">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{currentStreak}</span>
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-orange-100 text-sm mt-2">days in a row</p>
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm mb-1">Best Streak</p>
              <div className="text-3xl font-bold">{longestStreak}</div>
              <p className="text-orange-100 text-sm mt-2">days</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-slate-800">{totalCompletions}</div>
            <div className="text-sm text-slate-500 mt-1">Total Completions</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-slate-800">{completionRate}%</div>
            <div className="text-sm text-slate-500 mt-1">Last 7 Days</div>
          </div>
        </div>

        {/* Track Progress */}
        {track && (
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{track.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800">{track.name}</h3>
                <p className="text-sm text-slate-500">Day {profile.current_day} of 21</p>
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${((profile.current_day - 1) / 21) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Start</span>
              <span>{Math.round(((profile.current_day - 1) / 21) * 100)}% complete</span>
              <span>Day 21</span>
            </div>
          </div>
        )}

        {/* Mood Insights */}
        {mostCommonMood && (
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">Your Mood Pattern</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{mostCommonMood.emoji}</span>
              <div>
                <p className="text-slate-700">
                  You often feel <strong>{mostCommonMood.name.toLowerCase()}</strong>
                </p>
                <p className="text-sm text-slate-500">
                  {moodCounts[mostCommonMood.id]} times recorded
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Calendar */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Last 21 Days</h3>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  day.completed
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                    : day.isToday
                    ? 'bg-slate-200 text-slate-600 ring-2 ring-rose-400'
                    : 'bg-slate-100 text-slate-400'
                }`}
                title={day.date}
              >
                {day.completed ? '✓' : new Date(day.date).getDate()}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-100 rounded"></div>
              <span>Missed</span>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {currentStreak === 0 
              ? "Every journey starts with day one. You've got this! 🦁"
              : currentStreak < 7
              ? "You're building momentum. Keep going! 💪"
              : currentStreak < 14
              ? "One week strong! The habit is forming! 🔥"
              : "Two weeks! You're becoming unstoppable! 🏆"
            }
          </p>
        </div>
      </div>
    </div>
  )
}
