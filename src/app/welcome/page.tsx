'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const BRAND_COLORS = {
  deepPurple: '#5B21B6',
  magenta: '#A855F7',
  teal: '#14B8A6',
  gold: '#D4A574',
  navy: '#1E3A5F',
  lavender: '#E9D5FF',
}

const INTRO_SLIDES = [
  {
    title: "Train Your Confidence",
    description: "Start each day with an affirmation that shifts your mindset and prepares you to show up boldly.",
    icon: "💪",
  },
  {
    title: "Show Up Consistently",
    description: "Daily micro-missions designed for voice actors. Build your visibility habit in just 5 minutes a day.",
    icon: "🎯",
  },
  {
    title: "Shine Online",
    description: "Get platform-specific prompts that make posting easy. No more staring at a blank screen.",
    icon: "✨",
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const isLastSlide = currentSlide === INTRO_SLIDES.length - 1
  const isFirstSlide = currentSlide === 0

  const handleNext = () => {
    if (isLastSlide) {
      router.push('/onboarding')
    } else {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstSlide) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding')
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 15%, #f6f2ff 0%, #e6d8ff 20%, #caa9ff 40%, #9b6cff 65%, #6b3ccf 85%, #4a1d8c 100%)'
      }}
    >
      {/* Sparkle overlay - positioned at bottom */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 85%, rgba(255,255,255,0.5) 0%, transparent 8%),
            radial-gradient(circle at 85% 80%, rgba(255,255,255,0.4) 0%, transparent 6%),
            radial-gradient(circle at 25% 75%, rgba(255,255,255,0.35) 0%, transparent 5%),
            radial-gradient(circle at 75% 90%, rgba(255,255,255,0.45) 0%, transparent 7%),
            radial-gradient(circle at 50% 85%, rgba(255,255,255,0.3) 0%, transparent 10%),
            radial-gradient(circle at 35% 95%, rgba(255,255,255,0.4) 0%, transparent 6%),
            radial-gradient(circle at 65% 75%, rgba(255,255,255,0.35) 0%, transparent 5%),
            radial-gradient(circle at 45% 90%, rgba(255,255,255,0.3) 0%, transparent 8%),
            radial-gradient(circle at 90% 95%, rgba(255,255,255,0.25) 0%, transparent 4%),
            radial-gradient(circle at 10% 90%, rgba(255,255,255,0.3) 0%, transparent 5%)
          `,
          opacity: 0.25
        }}
      />

      {/* Welcome Screen (Slide 0 is special) */}
      {currentSlide === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          {/* Logo */}
          <div className="animate-fade-in" style={{ marginTop: '60px', marginBottom: '20px', width: '220px' }}>
            <Image
              src="/branding/logo-main.png"
              alt="Brave Takes"
              width={220}
              height={80}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Tagline */}
          <p 
            className="text-lg font-light tracking-wider mb-2"
            style={{ color: BRAND_COLORS.gold }}
          >
            Train • Show Up • Shine
          </p>
          
          {/* Subtitle */}
          <p className="text-slate-600 text-center text-sm max-w-xs mb-8">
            Your daily confidence ritual for creative visibility
          </p>

          {/* Main Headline - LARGEST */}
          <h1 
            className="text-4xl font-bold text-center leading-tight mb-5"
            style={{ color: '#4A1D8C' }}
          >
            Train. Show Up. Shine.
          </h1>

          {/* Start Button with gold glow - 20px below headline */}
          <button
            onClick={handleNext}
            className="px-12 py-4 rounded-full text-white font-semibold text-lg transform hover:scale-105 transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND_COLORS.deepPurple}, ${BRAND_COLORS.magenta})`,
              boxShadow: '0 0 30px rgba(212, 165, 116, 0.4), 0 4px 20px rgba(91, 33, 182, 0.3)'
            }}
          >
            Start My Brave Take
          </button>
        </div>
      ) : (
        /* Intro Slides */
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          {/* Skip button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSkip}
              className="text-white/60 hover:text-white text-sm font-medium"
            >
              Skip
            </button>
          </div>

          {/* Slide content */}
          <div className="text-center max-w-sm animate-slide-in">
            {/* Icon */}
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${BRAND_COLORS.lavender}, white)` 
              }}
            >
              <span className="text-5xl">{INTRO_SLIDES[currentSlide - 1]?.icon}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-white">
              {INTRO_SLIDES[currentSlide - 1]?.title}
            </h2>

            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed">
              {INTRO_SLIDES[currentSlide - 1]?.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-12 mb-8">
            {INTRO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx + 1 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 rounded-full border-2 border-white/50 text-white font-medium transition-all hover:bg-white/10"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-full text-white font-semibold transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${BRAND_COLORS.magenta}, ${BRAND_COLORS.deepPurple})`,
                boxShadow: '0 0 25px rgba(212, 165, 116, 0.35), 0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              {isLastSlide ? "Let's Go!" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
