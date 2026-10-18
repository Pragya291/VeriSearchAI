import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../auth/useAuth'
import { ResearchIllustration } from '../components/ResearchIllustration'
import { Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowRight, CheckCircle2, ShieldCheck, Check } from 'lucide-react'

export function Login({ initialMode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, signup, loginWithGoogle } = useAuth()

  // Tab mode: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/signup' || initialMode === 'signup' ? 'signup' : 'login'
  )

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('verisearch_remember_me') !== 'false'
    } catch {
      return true
    }
  })

  // Sign up form state
  const [fullName, setFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // General state
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  // Forgot password modal state
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSubmitted, setResetSubmitted] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')

  const from = location.state?.from || '/app/dashboard'

  // Sync tab with route if path changes
  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup')
    } else if (location.pathname === '/login') {
      setActiveTab('login')
    }
  }, [location.pathname])

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    if (tab === 'signup') {
      window.history.replaceState(null, '', '/signup')
      document.title = 'Sign Up | VeriSearch AI'
    } else {
      window.history.replaceState(null, '', '/login')
      document.title = 'Log In | VeriSearch AI'
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Google authentication failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e?.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    try {
      localStorage.setItem('verisearch_remember_me', rememberMe ? 'true' : 'false')
    } catch {
      // ignore
    }

    setLoading(true)
    try {
      await login({ email: trimmedEmail, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Invalid credentials. Please verify your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e?.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    const trimmedEmail = signupEmail.trim()
    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!signupPassword) {
      setError('Please choose a password.')
      return
    }
    if (signupPassword.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      await signup({
        full_name: fullName.trim(),
        email: trimmedEmail,
        password: signupPassword,
      })
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Registration could not be completed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = (e) => {
    e?.preventDefault()
    setResetError('')
    const trimmed = resetEmail.trim()
    if (!trimmed) {
      setResetError('Please enter your registered email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setResetError('Please enter a valid email address.')
      return
    }

    setResetLoading(true)
    setTimeout(() => {
      setResetLoading(false)
      setResetSubmitted(true)
    }, 800)
  }

  const closeResetModal = () => {
    setResetModalOpen(false)
    setResetSubmitted(false)
    setResetError('')
    setResetEmail('')
  }

  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[#F8FAFF] flex items-center justify-center p-4 sm:p-6 lg:py-3 lg:px-8 overflow-x-hidden overflow-y-auto lg:overflow-hidden selection:bg-blue-100 selection:text-blue-900 font-['Plus_Jakarta_Sans',sans-serif] no-scrollbar">
      {/* ============================================================== */}
      {/* SOFT AMBIENT BACKGROUND GRADIENTS (Exact visual match)         */}
      {/* ============================================================== */}
      {/* Top-left soft blue radial shape */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] sm:h-[540px] sm:w-[540px] rounded-full bg-blue-100/60 blur-[100px]"
        aria-hidden="true"
      />
      {/* Bottom-right soft blue radial shape */}
      <div
        className="pointer-events-none absolute -bottom-28 -right-28 h-[480px] w-[480px] sm:h-[620px] sm:w-[620px] rounded-full bg-blue-100/50 blur-[110px]"
        aria-hidden="true"
      />

      {/* Main 2-Column Responsive Container */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* ============================================================ */}
        {/* LEFT SECTION: BRAND, HEADLINE & ILLUSTRATION                */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-3.5 sm:space-y-5 lg:space-y-4 py-1">
          {/* Logo & Brand Name */}
          <Link
            to="/home"
            className="inline-flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01] self-start"
            aria-label="VeriSearch AI Home"
          >
            {/* Blue rounded-square logo with search/AI symbol */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[13px] bg-[#2563EB] flex items-center justify-center shadow-sm transition-colors group-hover:bg-[#1d4ed8]">
              <svg
                viewBox="0 0 100 100"
                className="h-5.5 w-5.5 text-white"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Search lens circle */}
                <circle
                  cx="44"
                  cy="44"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Search handle */}
                <line
                  x1="58"
                  y1="58"
                  x2="78"
                  y2="78"
                  stroke="currentColor"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                />
                {/* Inner AI sparkle / node */}
                <circle cx="44" cy="44" r="5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#172554]">
              VeriSearch AI
            </span>
          </Link>

          {/* Headline & Supporting text */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-[#172554] leading-[1.08]">
              Smarter<br />
              Research.<br />
              <span className="text-[#2563EB]">Faster.</span>
            </h1>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed max-w-sm pt-0.5">
              Get accurate insights, explore deeper, and save time with AI.
            </p>
          </div>

          {/* Research Dashboard & Laptop Illustration */}
          <div className="w-full max-w-[410px] lg:max-w-[420px] pt-0.5">
            <ResearchIllustration className="w-full" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT SECTION: WHITE LOGIN / SIGNUP CARD                   */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px] rounded-[24px] border border-[#DBEAFE] bg-white p-6 sm:p-7 lg:p-7 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.07),0_4px_16px_-4px_rgba(23,37,84,0.03)] transition-all">
            {/* 1. TABS: Log In & Sign Up */}
            <div className="flex rounded-xl bg-slate-100/80 p-1 border border-slate-100 mb-4 sm:mb-5">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-[#2563EB] shadow-xs border border-[#DBEAFE]'
                    : 'text-[#64748B] hover:text-[#172554]'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white text-[#2563EB] shadow-xs border border-[#DBEAFE]'
                    : 'text-[#64748B] hover:text-[#172554]'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs sm:text-[13px] text-rose-700 leading-relaxed flex items-start gap-2"
              >
                <span className="font-semibold shrink-0">•</span>
                <span>{error}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* LOG IN VIEW (Default strictly matching reference image)  */}
            {/* ======================================================== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-3.5">
                {/* 2. EMAIL FIELD */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1.5"
                  >
                    EMAIL
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail className="h-4.5 w-4.5 text-[#94A3B8]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                    />
                  </div>
                </div>

                {/* 3. PASSWORD FIELD */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1.5"
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-4.5 w-4.5 text-[#94A3B8]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-10 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#94A3B8] hover:text-[#64748B] focus:outline-none transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. REMEMBER ME ON LEFT & FORGOT PASSWORD ON RIGHT */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-[#64748B] select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#DBEAFE] text-[#2563EB] focus:ring-[#2563EB]/20 accent-[#2563EB] cursor-pointer"
                    />
                    <span className="font-normal text-[#64748B]">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setResetModalOpen(true)}
                    className="font-medium text-[#2563EB] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* 5. OUTLINED "CONTINUE WITH GOOGLE" BUTTON */}
                <div className="pt-1.5">
                  <button
                    id="google-signin-btn"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#DBEAFE] bg-white px-4 py-2.5 sm:py-2.5 text-sm font-semibold text-[#172554] shadow-xs hover:bg-slate-50 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 active:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {googleLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#2563EB]" />
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
                    <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                </div>

                {/* 6. SUBTLE HORIZONTAL DIVIDER WITH "or" */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-[#E2E8F0]" />
                  <span className="absolute bg-white px-3 text-xs text-[#94A3B8] font-normal">
                    or
                  </span>
                </div>

                {/* 7. FULL-WIDTH, BRIGHT BLUE "Log In →" PRIMARY BUTTON */}
                <div>
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white py-2.5 sm:py-3 px-4 text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <>
                        <span>Log In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* SIGN UP VIEW                                             */}
            {/* ======================================================== */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1"
                  >
                    FULL NAME
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="signupEmail"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1"
                  >
                    EMAIL
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      id="signupEmail"
                      name="signupEmail"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="signupPassword"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1"
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      id="signupPassword"
                      name="signupPassword"
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-10 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#94A3B8] hover:text-[#64748B] focus:outline-none transition-colors cursor-pointer"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1"
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-[#64748B] select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#DBEAFE] text-[#2563EB] focus:ring-[#2563EB]/20 accent-[#2563EB] cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-[#2563EB] font-medium hover:underline">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-[#2563EB] font-medium hover:underline">
                        Privacy Policy
                      </span>
                    </span>
                  </label>
                </div>

                {/* Google Sign In for Signup */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#DBEAFE] bg-white px-4 py-2.5 text-sm font-semibold text-[#172554] shadow-xs hover:bg-slate-50 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 active:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {googleLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#2563EB]" />
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
                    <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-[#E2E8F0]" />
                  <span className="absolute bg-white px-3 text-xs text-[#94A3B8] font-normal">
                    or
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white py-2.5 sm:py-3 px-4 text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 8. FOOTER TEXT: Don't have an account? Sign Up / Log In */}
            <div className="mt-4 pt-2 text-center text-xs sm:text-sm text-[#64748B]">
              {activeTab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('signup')}
                    className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FORGOT PASSWORD MODAL                                          */}
      {/* ============================================================== */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={closeResetModal}
          title="Reset Password"
        >
          {resetSubmitted ? (
            <div className="py-5 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-[#172554]">
                Password Reset Link Sent
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed">
                We've dispatched password reset instructions to{' '}
                <strong className="text-[#172554]">{resetEmail}</strong>. Please check your inbox and follow the link.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Back to Log In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Enter your registered researcher email address and we will send you a secure link to reset your password.
              </p>

              {resetError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                  {resetError}
                </div>
              )}

              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#172554] mb-1.5"
                >
                  EMAIL
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-4.5 w-4.5 text-[#94A3B8]" />
                  </div>
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#DBEAFE] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#172554] placeholder:text-[#94A3B8] hover:border-blue-300 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {resetLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  )
}

export default Login
