'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Affirmation from './Affirmation'
import { MEDITATION_TRACKS, TIMER_OPTIONS, STEP_MICROCOPY } from '@/lib/session-types'

interface Props {
  initialTrack?: string
  initialDuration?: number
  onComplete: (track: string, duration: number) => void
}

export default function ResetStep({ initialTrack, initialDuration = 120, onComplete }: Props) {
  const [selectedTrack, setSelectedTrack] = useState(initialTrack || MEDITATION_TRACKS[0].id)
  const [selectedDuration, setSelectedDuration] = useState(initialDuration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [timeRemaining, setTimeRemaining] = useState(selectedDuration)
  const [timerStarted, setTimerStarted] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element
  useEffect(() => {
    const track = MEDITATION_TRACKS.find(t => t.id === selectedTrack)
    if (track && typeof window !== 'undefined') {
      // For demo purposes, we'll use a placeholder. In production, use real audio files
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = volume
      
      // Try to load the track - will fail gracefully if file doesn't exist
      audioRef.current.src = track.url
      audioRef.current.load()
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [selectedTrack, volume])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimerComplete = useCallback(() => {
    setIsPlaying(false)
    setShowComplete(true)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timerStarted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, timerStarted, handleTimerComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!timerStarted) {
      setTimerStarted(true)
      setTimeRemaining(selectedDuration)
    }
    
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play().catch(() => {
        // Audio might not be available, continue anyway
        console.log('Audio playback not available')
      })
    }
    setIsPlaying(!isPlaying)
  }

  const handleSkipTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    setShowComplete(true)
  }

  const handleSelectDuration = (seconds: number) => {
    setSelectedDuration(seconds)
    setTimeRemaining(seconds)
    setTimerStarted(false)
  }

  const handleComplete = () => {
    onComplete(selectedTrack, selectedDuration)
  }

  const circumference = 2 * Math.PI * 45 // r = 45
  const progress = timerStarted ? (1 - timeRemaining / selectedDuration) : 0
  const strokeDashoffset = circumference * (1 - progress)

  if (showComplete) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Reset Complete</h2>
          <p className="text-amber-700">You took a moment for yourself. That's brave.</p>
        </div>

        <Affirmation category="reset" />

        <button
          onClick={handleComplete}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
        >
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Reset</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.reset}</p>
      </div>

      {/* Timer Circle */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="#fef3c7"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-900">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>⏸ Pause</>
          ) : timerStarted ? (
            <>▶️ Resume</>
          ) : (
            <>▶️ Start Reset</>
          )}
        </button>

        {timerStarted && (
          <button
            onClick={handleSkipTimer}
            className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Skip timer →
          </button>
        )}
      </div>

      {/* Duration Options */}
      {!timerStarted && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-600 mb-3">Duration</label>
          <div className="flex gap-3">
            {TIMER_OPTIONS.map((option) => (
              <button
                key={option.seconds}
                onClick={() => handleSelectDuration(option.seconds)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  selectedDuration === option.seconds
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Track Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">Background Sound</label>
        <div className="grid grid-cols-2 gap-2">
          {MEDITATION_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                selectedTrack === track.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="mt-4">
          <label className="block text-sm text-gray-500 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {!timerStarted && (
        <button
          onClick={() => setShowComplete(true)}
          className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
        >
          Skip reset →
        </button>
      )}
    </div>
  )
}
