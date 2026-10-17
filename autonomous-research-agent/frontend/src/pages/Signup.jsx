import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { BrandLogo } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../auth/useAuth'
import { User, Mail, Lock } from 'lucide-react'

export function Signup() {
  const navigate = useNavigate()
  const { user, signup, loginWithGoogle } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo className="justify-center mb-6" iconSize="h-9 w-9" textSize="text-2xl" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create your VeriSearchAI account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign up to access your research dashboard and verify claims.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200/90 bg-white py-8 px-6 sm:px-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
          {/* Prominent Log In / Sign Up Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <Link
              to="/login"
              className="flex-1 text-center rounded-lg py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              Log In
            </Link>
            <button
              type="button"
              className="flex-1 rounded-lg py-2 text-xs font-bold transition-all bg-white text-blue-600 shadow-xs cursor-default"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 leading-relaxed">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <div>
            <button
              id="google-signup-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              {googleLoading ? (
                <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
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
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200/90"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              placeholder="Dr. Jordan Hayes"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={User}
              required
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              autoComplete="new-password"
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              required
              autoComplete="new-password"
            />

            <div className="flex items-start gap-2.5 pt-1 text-xs">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                required
              />
              <label htmlFor="terms" className="text-slate-600 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('terms')}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={googleLoading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          {/* Bottom Link */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
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
                  Our evidence scoring uses empirical domain verification, peer-review checks, and multi-source consensus metrics.
                </p>
              </>
            )}
            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setPolicyModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Signup
