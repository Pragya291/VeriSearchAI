import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { BrandLogo } from '../components/layout/Navbar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../auth/useAuth'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'

export function Signup() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/app/dashboard" replace />
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo className="justify-center mb-6" iconSize="h-6 w-6" textSize="text-2xl" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create your VeriSearchAI account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign up to access your research dashboard and verify claims.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200/90 bg-white py-8 px-6 sm:px-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
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
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

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
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-3"
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
    </div>
  )
}

export default Signup
