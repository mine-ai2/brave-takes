'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MEDITATION_TRACKS, STEP_MICROCOPY } from '@/lib/session-types'

interface Props {
  postDraft?: string
  onComplete: (recordingUrl: string | null) => void
}

type RecordingState = 'idle' | 'ready' | 'countdown' | 'recording' | 'preview'

export default function RecordingStudio({ postDraft, onComplete }: Props) {
  const [state, setState] = useState<RecordingState>('idle')
  const [hasPermissions, setHasPermissions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [textOverlay, setTextOverlay] = useState(postDraft?.slice(0, 100) || '')
  const [showOverlay, setShowOverlay] = useState(true)
  const [selectedBgMusic, setSelectedBgMusic] = useState<string | null>(null)
  const [bgVolume, setBgVolume] = useState(0.3)

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Request camera permissions
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 720, height: 1280 },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasPermissions(true)
      setState('ready')
      setError(null)
    } catch (err) {
      console.error('Camera permission error:', err)
      setError('Could not access camera. Please allow camera and microphone permissions.')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
      }
      if (countdownRef.current) clearInterval(countdownRef.current)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    }
  }, [recordingUrl])

  const startCountdown = () => {
    setState('countdown')
    setCountdown(3)
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          startRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startRecording = () => {
    if (!streamRef.current) return

    setState('recording')
    setRecordingTime(0)
    chunksRef.current = []

    // Start background music if selected
    if (selectedBgMusic) {
      const track = MEDITATION_TRACKS.find(t => t.id === selectedBgMusic)
      if (track) {
        bgAudioRef.current = new Audio(track.url)
        bgAudioRef.current.loop = true
        bgAudioRef.current.volume = bgVolume
        bgAudioRef.current.play().catch(() => {})
      }
    }

    // Create MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4'

    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType,
        videoBitsPerSecond: 2500000,
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setRecordingUrl(url)
        setState('preview')
        
        if (bgAudioRef.current) {
          bgAudioRef.current.pause()
        }
      }

      mediaRecorderRef.current.start(100)

      // Recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Recording error:', err)
      setError('Recording failed. Your browser may not support video recording.')
      setState('ready')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.pause()
    }
  }

  const reRecord = () => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl)
    }
    setRecordingUrl(null)
    setState('ready')
  }

  const downloadRecording = async () => {
    if (!recordingUrl) return

    // If we have text overlay, we need to burn it into the video
    // For MVP, we'll just download the raw video
    // Text overlay burning requires complex canvas manipulation
    
    const link = document.createElement('a')
    link.href = recordingUrl
    link.download = `brave-take-${Date.now()}.webm`
    link.click()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleComplete = () => {
    onComplete(recordingUrl)
  }

  const handleSkip = () => {
    onComplete(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Recording Studio</h2>
        <p className="text-amber-700">{STEP_MICROCOPY.studio}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Video Preview Area */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] max-h-[50vh] mx-auto">
        {state !== 'preview' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Text Overlay Preview */}
            {showOverlay && textOverlay && state !== 'idle' && (
              <div className="absolute bottom-16 left-4 right-4 p-4 bg-black/60 rounded-xl">
                <p className="text-white text-center font-medium text-sm">
                  {textOverlay}
                </p>
              </div>
            )}

            {/* Countdown Overlay */}
            {state === 'countdown' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-8xl font-bold text-white animate-pulse">
                  {countdown}
                </span>
              </div>
            )}

            {/* Recording Indicator */}
            {state === 'recording' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <span className="w-3 h-3 bg-white rounded-full recording-pulse" />
                <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
              </div>
            )}
          </>
        ) : (
          <video
            ref={previewRef}
            src={recordingUrl || undefined}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Idle State */}
        {state === 'idle' && !hasPermissions && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <span className="text-6xl mb-4">🎥</span>
            <p className="text-center mb-4">
              Record yourself saying your brave take out loud.
            </p>
            <button
              onClick={requestPermissions}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Enable Camera
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {state === 'ready' && (
        <div className="space-y-4">
          {/* Text Overlay Input */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Text Overlay</label>
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Show
              </label>
            </div>
            <input
              type="text"
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value.slice(0, 100))}
              placeholder="Add text to appear in video..."
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-400 focus:outline-none"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1">{textOverlay.length}/100</p>
          </div>

          {/* Background Music */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Background Music (optional)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedBgMusic(null)}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  !selectedBgMusic
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                None
              </button>
              {MEDITATION_TRACKS.slice(0, 5).map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedBgMusic(track.id)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    selectedBgMusic === track.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
            
            {selectedBgMusic && (
              <div className="mt-3">
                <label className="text-xs text-gray-500">Music Volume: {Math.round(bgVolume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={bgVolume}
                  onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <button
            onClick={startCountdown}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🔴</span> Start Recording
          </button>
        </div>
      )}

      {state === 'recording' && (
        <button
          onClick={stopRecording}
          className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-colors text-lg"
        >
          ⬛ Stop Recording
        </button>
      )}

      {state === 'preview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={reRecord}
              className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              🔄 Re-record
            </button>
            <button
              onClick={downloadRecording}
              className="py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              ⬇️ Download
            </button>
          </div>
          
          <button
            onClick={handleComplete}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Skip option */}
      {(state === 'idle' || state === 'ready') && (
        <button
          onClick={handleSkip}
          className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          Skip recording →
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
