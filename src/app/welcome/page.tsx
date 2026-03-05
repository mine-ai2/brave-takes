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
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40 flex flex-col">
      {/* Welcome Screen (Slide 0 is special) */}
      {currentSlide === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <Image
              src="/branding/logo-main.png"
              alt="Brave Takes"
              width={320}
              height={180}
              className="w-80 h-auto"
              priority
            />
          </div>

          {/* Tagline */}
          <h1 
            className="text-2xl font-light tracking-wider mb-2"
            style={{ color: BRAND_COLORS.gold }}
          >
            Train • Show Up • Shine
          </h1>
          
          <p className="text-slate-600 text-center max-w-xs mb-12">
            Your daily confidence ritual for creative visibility
          </p>

          {/* Start Button */}
          <button
            onClick={handleNext}
            className="px-12 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND_COLORS.deepPurple}, ${BRAND_COLORS.magenta})` 
            }}
          >
            Get Started
          </button>

          {/* Footer */}
          <div className="mt-auto pt-8">
            <Image
              src="/branding/created-by-footer.png"
              alt="Created by Carrie Farris"
              width={300}
              height={60}
              className="w-64 h-auto opacity-70"
            />
          </div>
        </div>
      ) : (
        /* Intro Slides */
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Skip button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium"
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
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: BRAND_COLORS.deepPurple }}
            >
              {INTRO_SLIDES[currentSlide - 1]?.title}
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed">
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
                    ? 'w-8' 
                    : 'w-2 opacity-40'
                }`}
                style={{ 
                  backgroundColor: currentSlide === idx + 1 
                    ? BRAND_COLORS.deepPurple 
                    : BRAND_COLORS.magenta 
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 rounded-full border-2 font-medium transition-all hover:bg-purple-50"
              style={{ 
                borderColor: BRAND_COLORS.deepPurple,
                color: BRAND_COLORS.deepPurple,
              }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${BRAND_COLORS.deepPurple}, ${BRAND_COLORS.magenta})` 
              }}
            >
              {isLastSlide ? "Let's Go!" : "Next"}
            </button>
          </div>

          {/* Microphone icon at bottom */}
          <div className="mt-auto pt-8 opacity-30">
            <Image
              src="/branding/microphone-icon.png"
              alt=""
              width={60}
              height={60}
              className="w-12 h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
