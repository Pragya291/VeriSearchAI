import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../auth/useAuth'

const steps = [
  { number: '01', title: 'Search', description: 'Find relevant information from multiple sources.', icon: Search },
  { number: '02', title: 'Analyze', description: 'AI analyzes the information and identifies important claims.', icon: BrainCircuit },
  { number: '03', title: 'Verify', description: 'Compare sources and detect supporting or conflicting evidence.', icon: ShieldCheck },
  { number: '04', title: 'Report', description: 'Generate a clear research report with confidence levels and sources.', icon: FileCheck2 },
]

const features = [
  { title: 'Multi-source Research', description: 'Gather useful context across independent sources.', icon: Search },
  { title: 'Claim Verification', description: 'See which statements are supported by the evidence.', icon: CheckCircle2 },
  { title: 'Source Credibility', description: 'Review source relevance and credibility signals.', icon: ShieldCheck },
  { title: 'Conflicting Evidence', description: 'Bring opposing findings and disagreements into view.', icon: Scale },
  { title: 'AI Research Analysis', description: 'Turn large collections of information into clear findings.', icon: BrainCircuit },
  { title: 'Evidence-backed Reports', description: 'Keep conclusions connected to their supporting sources.', icon: FileText },
]

function Brand({ compact = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="VeriSearchAI home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <Search className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-base font-semibold tracking-tight text-slate-100">VeriSearchAI</span>
        {!compact && <span className="block text-xs text-slate-400">Research &amp; source verification</span>}
      </span>
    </Link>
  )
}

function ResearchVisual() {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-100">Evidence review</p>
            <p className="text-xs text-slate-400">Research synthesis</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
          <Check className="h-3 w-3" /> Verified
        </span>
      </div>

      <div className="py-5">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Research question</p>
        <p className="mt-2 text-base font-medium leading-6 text-slate-100">How strong is the evidence behind this claim?</p>
      </div>

      <div className="space-y-2.5">
        {[
          { label: 'Independent sources', detail: 'Retrieved', color: 'text-indigo-300', icon: Search },
          { label: 'Evidence alignment', detail: 'Compared', color: 'text-emerald-300', icon: ShieldCheck },
          { label: 'Conflicts', detail: 'Checked', color: 'text-amber-300', icon: Scale },
        ].map(({ label, detail, color, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Icon className={`h-4 w-4 shrink-0 ${color}`} />
              <span className="truncate text-sm text-slate-300">{label}</span>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{detail}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
        <span className="text-sm text-slate-300">Evidence confidence</span>
        <span className="text-xs font-medium text-indigo-200">Evidence-based</span>
      </div>
    </div>
  )
}

function PublicNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Brand compact />
        <div className="hidden items-center gap-8 md:flex">
          <a className="text-sm text-slate-300 transition hover:text-white" href="#home">Home</a>
          <a className="text-sm text-slate-300 transition hover:text-white" href="#how-it-works">How It Works</a>
          <a className="text-sm text-slate-300 transition hover:text-white" href="#features">Features</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white" to="/login">Log In</Link>
          <Link className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 sm:px-4" to="/signup">Sign Up</Link>
        </div>
      </nav>
    </header>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <PublicNav />
      <main>
        <section id="home" className="border-b border-slate-800/80">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" /> AI research and source verification
              </div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-300">VeriSearchAI</p>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Research deeper.<br />Verify smarter.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                AI-powered research that searches multiple sources, verifies claims, compares conflicting evidence, and generates evidence-backed conclusions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                  Create Account <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                  Explore VeriSearchAI
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Claims tied to evidence</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Conflicts made visible</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ResearchVisual />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-slate-800/80 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-9 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-300">A clear path to confidence</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">From an open question to a grounded conclusion.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ number, title, description, icon: Icon }) => (
                <article key={number} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-slate-500">{number}</span>
                    <Icon className="h-5 w-5 text-indigo-300" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-300">Built for careful research</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Evidence first, from search to report.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">Keep the sources, claims, and disagreements visible while turning research into something you can evaluate.</p>
            </div>
            <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, icon: Icon }) => (
                <article key={title} className="flex gap-4 border-t border-slate-800 py-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                    <p className="mt-1.5 text-sm leading-5 text-slate-400">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Ready to research with confidence?</h2>
              <p className="mt-2 text-sm text-slate-400">Start with a question. Keep every conclusion connected to its evidence.</p>
            </div>
            <Link to="/signup" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Brand compact />
          <p className="text-xs text-slate-500">Research carefully. Verify what matters.</p>
          <p className="text-xs text-slate-500">© 2026 VeriSearchAI</p>
        </div>
      </footer>
    </div>
  )
}

export function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signup, login } = useAuth()
  const [notice, setNotice] = useState(() => (
    location.state?.registrationSuccess ? 'Registration successful. Please log in to continue.' : ''
  ))
  const [noticeType, setNoticeType] = useState('success')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [navigate, user])

  useEffect(() => {
    if (!registrationComplete) return undefined

    const timer = setTimeout(() => {
      navigate('/login', {
        replace: true,
        state: { registrationSuccess: true, email: registeredEmail },
      })
    }, 1100)

    return () => clearTimeout(timer)
  }, [navigate, registeredEmail, registrationComplete])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (isSignup && formData.get('password') !== formData.get('confirmPassword')) {
      setNotice('Passwords do not match.')
      setNoticeType('error')
      return
    }

    setIsSubmitting(true)
    setNotice('')

    try {
      if (isSignup) {
        const account = await signup({
          full_name: formData.get('fullName'),
          email: formData.get('email'),
          password: formData.get('password'),
        })
        setRegisteredEmail(account.email)
        setNotice('Registration successful. Redirecting you to log in...')
        setNoticeType('success')
        setRegistrationComplete(true)
      } else {
        await login({
          email: formData.get('email'),
          password: formData.get('password'),
        })
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      setNotice(error.response?.data?.detail || 'Unable to complete your request. Please try again.')
      setNoticeType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="flex flex-col justify-between border-b border-slate-800 px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-10">
          <Brand />
          <div className="mx-auto w-full max-w-lg py-12 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-300">Trustworthy AI research</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Research with the evidence in view.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
              Search across sources, verify claims, and compare evidence before drawing a conclusion.
            </p>
            <div className="mt-8 hidden sm:block">
              <ResearchVisual />
            </div>
          </div>
          <p className="text-xs text-slate-500">Independent sources. Transparent evidence. Clearer conclusions.</p>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/10 sm:p-8">
            <div className="mb-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                {isSignup ? <LockKeyhole className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                {isSignup ? 'Create your VeriSearchAI account' : 'Welcome back to VeriSearchAI'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isSignup ? 'Set up your account to keep your research organized.' : 'Log in to continue your research.'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isSignup && (
                <label className="block text-sm font-medium text-slate-300">
                  Full Name
                  <input name="fullName" type="text" autoComplete="name" required className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="Janahvi Loke" />
                </label>
              )}
              <label className="block text-sm font-medium text-slate-300">
                  Email Address
                  <input name="email" type="email" autoComplete="email" required defaultValue={location.state?.email || ''} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="janahvi@example.com" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Password
                <input name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} required minLength={8} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="At least 8 characters" />
              </label>
              {isSignup ? (
                <label className="block text-sm font-medium text-slate-300">
                  Confirm Password
                  <input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="Re-enter your password" />
                </label>
              ) : (
                <div className="-mt-1 flex justify-end">
                  <button type="button" onClick={() => { setNotice('Password recovery is not available yet.'); setNoticeType('error') }} className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200">Forgot Password?</button>
                </div>
              )}

                <button type="submit" disabled={isSubmitting || (isSignup && registrationComplete)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-70">
                  {isSubmitting ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'} {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

              {notice && <p className={`mt-4 rounded-lg border px-3 py-2.5 text-sm ${noticeType === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'}`} role={noticeType === 'success' ? 'status' : 'alert'}>{notice}</p>}

            <p className="mt-6 text-center text-sm text-slate-400">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <Link className="font-semibold text-indigo-300 transition hover:text-indigo-200" to={isSignup ? '/login' : '/signup'}>
                {isSignup ? 'Log in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}