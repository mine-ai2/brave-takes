'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function WelcomePage() {
  const router = useRouter()

  const handleStart = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // User is logged in, check onboarding status
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', user.id)
        .single()
      
      if (profile?.onboarding_complete) {
        // Already onboarded, go to today
        router.push('/today')
      } else {
        // Need to complete onboarding
        router.push('/onboarding')
      }
    } else {
      // Not logged in, go to onboarding (will redirect to signup/login)
      router.push('/onboarding')
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #faf8ff 0%, #f5f0ff 15%, #efe6ff 30%, #e8dcff 50%, #dfd0f5 70%, #d4c4eb 85%, #c9b8e0 100%)'
      }}
    >
      {/* Golden sparkle glow at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,215,150,0.4) 0%, rgba(255,200,120,0.25) 25%, rgba(200,170,220,0.2) 50%, transparent 80%)',
        }}
      />
      
      {/* Additional sparkle points */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '40%',
          background: `
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.6) 0%, transparent 3%),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.5) 0%, transparent 2%),
            radial-gradient(circle at 20% 85%, rgba(255,220,180,0.7) 0%, transparent 4%),
            radial-gradient(circle at 80% 75%, rgba(255,220,180,0.6) 0%, transparent 3%),
            radial-gradient(circle at 50% 90%, rgba(255,255,255,0.8) 0%, transparent 5%),
            radial-gradient(circle at 40% 78%, rgba(255,230,200,0.5) 0%, transparent 2%),
            radial-gradient(circle at 60% 85%, rgba(255,230,200,0.6) 0%, transparent 3%),
            radial-gradient(circle at 25% 92%, rgba(255,255,255,0.4) 0%, transparent 2%),
            radial-gradient(circle at 75% 88%, rgba(255,255,255,0.5) 0%, transparent 2%)
          `,
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        
        {/* Logo */}
        <div className="mb-4" style={{ width: '320px', marginTop: '60px' }}>
          <Image
            src="/branding/logo-main.png"
            alt="Brave Takes"
            width={320}
            height={124}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p 
          className="text-center italic mb-1"
          style={{ color: '#6b4c9a', fontSize: '15px' }}
        >
          Confidence Training for Creative Visibility
        </p>
        
        {/* Created by */}
        <p 
          className="text-center mb-10"
          style={{ color: '#c9a227', fontSize: '14px', fontStyle: 'italic' }}
        >
          — Created by <span style={{ fontFamily: 'cursive' }}>Carrie Farris</span> —
        </p>

        {/* Headline */}
        <h1 
          className="text-center font-bold leading-tight mb-10"
          style={{ color: '#4a2c7a', fontSize: '36px' }}
        >
          Show Up.<br />
          Speak Up. Shine.
        </h1>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="px-10 py-4 rounded-full text-white font-semibold text-lg transform hover:scale-105 transition-all mb-6"
          style={{ 
            background: 'linear-gradient(135deg, #6b3fa0 0%, #8b5fc0 50%, #7b4fb0 100%)',
            boxShadow: '0 8px 24px rgba(107,63,160,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            minWidth: '240px'
          }}
        >
          Start My Brave Take
        </button>

        {/* Helper text */}
        <p 
          className="text-center"
          style={{ color: '#7b5a9e', fontSize: '14px' }}
        >
          Start your first Brave Take.
        </p>

        {/* Bottom spacer */}
        <div style={{ height: '80px' }} />
      </div>
    </div>
  )
}
