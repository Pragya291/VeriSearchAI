import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../auth/useAuth'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react'

export function Signup() {
  const navigate = useNavigate()
  const { user, signup, loginWithGoogle } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  // Terms & Privacy modal state
  const [policyModal, setPolicyModal] = useState(null) // 'terms' | 'privacy' | null

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Google signup failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signup({ full_name: fullName, email, password })
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-white bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(219,234,254,0.45),rgba(255,255,255,1))] flex flex-col justify-center items-center py-4 px-4 sm:px-6 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* 1. Header with centered logo & text */}
      <div className="w-full max-w-[560px] text-center mb-3 sm:mb-4 shrink-0">
        <Link 
          to="/home" 
          className="inline-flex items-center justify-center gap-2 mb-2 group transition-transform duration-200 hover:scale-[1.02]"
          aria-label="VeriSearch AI Home"
        >
          {/* Blue search-and-check logo */}
          <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-xs transition-colors group-hover:bg-[#1d4ed8]">
            <svg 
              viewBox="0 0 100 100" 
              className="h-4.5 w-4.5 text-white" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="44" cy="44" r="18.5" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="58" y1="58" x2="78" y2="78" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M32 44L44 56L73 27" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#172554]">
            VeriSearch AI
          </span>
        </Link>

        {/* Heading & Subtitle */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172554] leading-tight">
          Create your account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Sign up to access your research dashboard and verify claims.
        </p>
      </div>

      {/* 2. Centered White Card ~560px wide on desktop */}
      <div className="w-full max-w-[560px] shrink-0">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_10px_35px_-8px_rgba(37,99,235,0.06),0_4px_16px_-4px_rgba(0,0,0,0.03)]">
          {/* 1. Tabs: Log In and Sign Up */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-[#E5E7EB] mb-4 sm:mb-5">
            <Link
              to="/login"
              className="flex-1 rounded-lg py-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Log In</span>
            </Link>
            <button
              type="button"
              className="flex-1 rounded-lg py-1.5 text-xs sm:text-sm font-semibold transition-all bg-white text-[#2563EB] shadow-xs flex items-center justify-center gap-1.5 cursor-default"
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Dr. Jordan Hayes"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3.5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3.5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-10 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3.5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1 text-xs">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/20 accent-[#2563EB] cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-slate-600 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('terms')}
                  className="font-medium text-[#2563EB] hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="font-medium text-[#2563EB] hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Action Buttons Container */}
            <div className="space-y-3 pt-2">
              {/* Continue with Google button */}
              <button
                id="google-signup-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-2.5 sm:py-3 text-sm font-medium text-slate-700 shadow-2xs hover:bg-blue-50/40 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 active:bg-blue-50/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              >
                {googleLoading ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-slate-300 border-t-[#2563EB]" />
                ) : (
                  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 sm:py-3 px-4 text-sm font-semibold shadow-xs transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                {loading ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Text */}
          <div className="mt-8 pt-5 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-100">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline transition-colors ml-1"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Modal */}
      {policyModal && (
        <Modal
          isOpen={Boolean(policyModal)}
          onClose={() => setPolicyModal(null)}
          title={policyModal === 'terms' ? 'Terms of Service' : 'Privacy & Methodology Policy'}
        >
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {policyModal === 'terms' ? (
              <>
                <p>
                  Welcome to <strong>VeriSearchAI</strong>. By using our autonomous research agent, you agree to evaluate evidence objectively and respect intellectual property rights.
                </p>
                <p>
                  VeriSearchAI retrieves multi-source academic and open web data to synthesize verdicts. All citations remain the property of their respective publishers.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>VeriSearchAI Privacy Standards</strong>: We encrypt session data, respect research confidentiality, and never sell personal researcher logs.
                </p>
                <p>
                  All external query queries are proxied anonymously through high-trust verifier networks.
                </p>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Signup
