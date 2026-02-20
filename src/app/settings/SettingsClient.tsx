'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import Navigation from '@/components/Navigation'

interface Props {
  email: string
  profile: Profile | null
}

export default function SettingsClient({ email, profile }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-amber-900">Settings</h1>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="text-gray-800">{email}</p>
            </div>
            {profile?.user_type && (
              <div>
                <span className="text-sm text-gray-500">Type</span>
                <p className="text-gray-800">{profile.user_type}</p>
              </div>
            )}
            {profile?.created_at && (
              <div>
                <span className="text-sm text-gray-500">Member since</span>
                <p className="text-gray-800">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About Brave Takes</h2>
          <p className="text-gray-600 text-sm">
            Brave Takes helps voice actors build confidence in self-promotion through
            daily micro-challenges. One rep at a time, you&apos;re building your bravery muscle.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Built with ❤️ by Carrie Farris
          </p>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      <Navigation current="settings" />
    </div>
  )
}
