'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const USER_TYPES = [
  'Aspiring Voice Actor',
  'Working Voice Actor',
  'Voice Actor Coach',
  'Other Creative Professional',
]

const FEARS = [
  'Being judged by peers',
  'Posting cringy content',
  'Not being good enough',
  'Seeming too "salesy"',
  'Wasting time on social media',
  'Being ignored',
]

const AVOIDANCES = [
  'I never post',
  'I draft but delete',
  'I post rarely (monthly or less)',
  'I post but feel terrible after',
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [topFear, setTopFear] = useState('')
  const [avoidance, setAvoidance] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        user_type: userType,
        top_fear: topFear,
        avoidance: avoidance,
      })

    if (error) {
      console.error('Error saving profile:', error)
      setLoading(false)
      return
    }

    router.push('/today')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome to Brave Takes</h1>
          <p className="text-amber-700">Let&apos;s personalize your experience</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i <= step ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                What describes you best?
              </h2>
              {USER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setUserType(type)
                    setStep(2)
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    userType === type
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                What&apos;s your biggest fear about posting?
              </h2>
              {FEARS.map((fear) => (
                <button
                  key={fear}
                  onClick={() => {
                    setTopFear(fear)
                    setStep(3)
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    topFear === fear
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {fear}
                </button>
              ))}
              <button
                onClick={() => setStep(1)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                What best describes your posting behavior?
              </h2>
              {AVOIDANCES.map((avoid) => (
                <button
                  key={avoid}
                  onClick={() => setAvoidance(avoid)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    avoidance === avoid
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {avoid}
                </button>
              ))}
              
              {avoidance && (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? 'Saving...' : 'Start My Journey →'}
                </button>
              )}
              
              <button
                onClick={() => setStep(2)}
                className="w-full mt-2 text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
