'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { BRAND } from '@/lib/brand'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

const TURNSTILE_SITE_KEY = '0x4AAAAAACwZ8HNMbJdEJyUH'

type AuthMode = 'login' | 'signup' | 'forgot' | 'magic'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  
  const supabase = createClient()

  const resetCaptcha = () => {
    setCaptchaToken(null)
    turnstileRef.current?.reset()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      setMessage({ type: 'error', text: 'Please complete the captcha' })
      return
    }
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    })

    resetCaptcha()
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else {
      router.push('/today')
      router.refresh()
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      setMessage({ type: 'error', text: 'Please complete the captcha' })
      return
    }
    setLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        captchaToken,
      },
    })

    resetCaptcha()
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email to confirm your account!' })
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      setMessage({ type: 'error', text: 'Please complete the captcha' })
      return
    }
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      captchaToken,
    })

    resetCaptcha()
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the password reset link!' })
    }
    setLoading(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      setMessage({ type: 'error', text: 'Please complete the captcha' })
      return
    }
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        captchaToken,
      },
    })

    resetCaptcha()
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setMessage(null)
    resetCaptcha()
  }

  const inputStyles = `w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-800 placeholder-slate-400`
  
  const buttonStyles = {
    background: BRAND.gradients.button,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${BRAND.colors.lavender}, white)` }}>
            <Image
              src="/branding/microphone-icon.png"
              alt="Brave Takes"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.colors.deepPurple }}>
            Brave Takes
          </h1>
          <p className="text-slate-600">Confidence training for creative visibility</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
          {/* Mode Tabs */}
          {mode !== 'forgot' && mode !== 'magic' && (
            <div className="flex bg-purple-50 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode('login'); resetForm(); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={{ color: mode === 'login' ? BRAND.colors.deepPurple : undefined }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); resetForm(); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={{ color: mode === 'signup' ? BRAND.colors.deepPurple : undefined }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputStyles}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputStyles}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); resetForm(); }}
                  className="text-sm hover:underline"
                  style={{ color: BRAND.colors.magenta }}
                >
                  Forgot password?
                </button>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={buttonStyles}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputStyles}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputStyles}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={buttonStyles}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2" style={{ color: BRAND.colors.deepPurple }}>
                  Reset Password
                </h2>
                <p className="text-slate-600 text-sm">Enter your email to receive a reset link</p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputStyles}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={buttonStyles}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

          {/* Magic Link Form */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2" style={{ color: BRAND.colors.deepPurple }}>
                  Magic Link
                </h2>
                <p className="text-slate-600 text-sm">Sign in without a password</p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputStyles}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={buttonStyles}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
              
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
          
          {/* Turnstile CAPTCHA */}
          <div className="mt-4 flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              options={{ theme: 'light', size: 'normal' }}
            />
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-4 rounded-xl text-center text-sm ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Magic Link Alternative */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="mt-6 pt-6 border-t border-purple-100">
              <button
                onClick={() => { setMode('magic'); resetForm(); }}
                className="w-full py-3 px-4 border-2 font-medium rounded-xl transition-all text-sm hover:bg-purple-50"
                style={{ borderColor: BRAND.colors.deepPurple, color: BRAND.colors.deepPurple }}
              >
                ✨ Sign in with Magic Link instead
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: BRAND.colors.gold }}>
          Train • Show Up • Shine
        </p>
      </div>
    </div>
  )
}
