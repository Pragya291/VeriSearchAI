import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Bookmark, Download, Search, Share2, ShieldCheck, SlidersHorizontal, Trash2 } from 'lucide-react'

import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MobileMenu from './components/layout/MobileMenu'
import StatCard from './components/dashboard/StatCard'
import RecentResearch from './components/dashboard/RecentResearch'
import ResearchInput from './components/research/ResearchInput'
import ResearchProgress from './components/research/ResearchProgress'
import ResearchSummary from './components/research/ResearchSummary'
import ClaimCard from './components/research/ClaimCard'
import SourceCard from './components/research/SourceCard'
import ConflictCard from './components/research/ConflictCard'
import EmptyState from './components/common/EmptyState'
import Button from './components/common/Button'
import { exampleQuestions } from './data/exampleQuestions'
import { AuthPage, LandingPage } from './pages/PublicPages'
import { AuthProvider } from './auth/AuthProvider'
import { useAuth } from './auth/useAuth'
import { getResearchById, getResearchHistory, submitResearch } from './services/api'

function App() {
  const [query, setQuery] = useState('')
  const [recentReports, setRecentReports] = useState([])
  const [appearance, setAppearance] = useState(() => {
    const savedAppearance = window.localStorage.getItem('verisearchai-appearance')
    return ['Light', 'Dark', 'System'].includes(savedAppearance) ? savedAppearance : 'Light'
  })
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const theme = appearance === 'Dark' || (appearance === 'System' && systemPrefersDark) ? 'dark' : 'light'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemPreference = (event) => setSystemPrefersDark(event.matches)
    mediaQuery.addEventListener('change', updateSystemPreference)
    return () => mediaQuery.removeEventListener('change', updateSystemPreference)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('verisearchai-appearance', appearance)
    window.localStorage.setItem('verisearchai-theme', theme)
  }, [appearance, theme])

  return (
    <BrowserRouter>
      <AuthProvider>
        <PageMetadata />
        <AppShell
          query={query}
          setQuery={setQuery}
          recentReports={recentReports}
          setRecentReports={setRecentReports}
          theme={theme}
          appearance={appearance}
          setAppearance={setAppearance}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

function PageMetadata() {
  const location = useLocation()
  const pageTitles = {
    '/': 'AI Research & Source Verification',
    '/login': 'Log In',
    '/signup': 'Create Account',
    '/dashboard': 'Research Dashboard',
    '/new-research': 'New Research',
    '/research': 'Research in Progress',
    '/history': 'Research History',
    '/saved': 'Saved Reports',
    '/settings': 'Settings',
  }
  const title = location.pathname.startsWith('/report/')
    ? 'Research Report'
    : pageTitles[location.pathname] || 'AI Research'

  useEffect(() => {
    document.title = `${title} | VeriSearchAI`
  }, [title])

  return null
}

function AppShell({ query, setQuery, recentReports, setRecentReports, theme, appearance, setAppearance, menuOpen, setMenuOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading, logout } = useAuth()
  const isDark = theme === 'dark'
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname)

  const pageMeta = useMemo(() => {
    if (location.pathname === '/history') {
      return { title: 'Research History', subtitle: 'Track evidence, results, and trust signals across all investigations.' }
    }

    if (location.pathname === '/saved') {
      return { title: 'Saved Reports', subtitle: 'Access your previously generated research reports.' }
    }

    if (location.pathname === '/settings') {
      return { title: 'Settings', subtitle: 'Customize analysis preferences and research defaults.' }
    }

    if (location.pathname === '/research') {
      return { title: 'Researching your question', subtitle: 'Monitoring search, evidence collection, and source analysis.' }
    }

    if (location.pathname === '/new-research') {
      return { title: 'New Research', subtitle: 'Start an AI-powered investigation and discover reliable evidence.' }
    }

    if (location.pathname.startsWith('/report')) {
      return { title: 'Research Report', subtitle: 'Evidence-backed conclusions and source verification.' }
    }

    if (location.pathname === '/dashboard') {
      return { title: 'Research Dashboard', subtitle: 'Investigate questions, verify claims, and discover reliable evidence.' }
    }

    return { title: 'VeriSearchAI', subtitle: 'Research with evidence you can trust.' }
  }, [location.pathname])

  useEffect(() => {
    window.localStorage.setItem('verisearchai-theme', theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    if (!user) return undefined

    let isActive = true
    getResearchHistory()
      .then(({ data }) => {
        if (!isActive) return
        setRecentReports((current) => {
          const currentById = new Map(current.map((report) => [report.research_id, report]))
          return data.items.map((item) => currentById.get(item.research_id) || ({
            research_id: item.research_id,
            question: item.question,
            status: item.status,
            confidence: item.confidence || 0,
            source_count: item.source_count,
            claim_count: item.claim_count,
            completed_at: item.completed_at,
            sources: [],
            claims: [],
          }))
        })
      })
      .catch(() => {})

    return () => { isActive = false }
  }, [setRecentReports, user])

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage key="login" mode="login" />} />
        <Route path="/signup" element={<AuthPage key="signup" mode="signup" />} />
      </Routes>
    )
  }

  if (isLoading) {
    return (
      <main className={isDark ? 'flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200' : 'flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700'} aria-live="polite">
        <div className={isDark ? 'flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm' : 'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm'}>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Checking your VeriSearchAI session...
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const handleSubmit = (question = query, options = {}) => {
    const nextQuestion = question.trim()
    if (!nextQuestion) return
    setQuery(nextQuestion)
    navigate('/research', { state: { question: nextQuestion, options } })
  }

  return (
    <div className={isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}>
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar
          theme={theme}
          user={user}
          onLogout={async () => {
            setRecentReports([])
            await logout()
            navigate('/login', { replace: true })
          }}
          onToggleTheme={() => setAppearance(theme === 'dark' ? 'Light' : 'Dark')}
        />
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          theme={theme}
          user={user}
          onLogout={async () => {
            setMenuOpen(false)
            setRecentReports([])
            await logout()
            navigate('/login', { replace: true })
          }}
          onToggleTheme={() => setAppearance(theme === 'dark' ? 'Light' : 'Dark')}
        />

        <main className="flex-1">
          <Header
            title={pageMeta.title}
            subtitle={pageMeta.subtitle}
            onMenuClick={() => setMenuOpen(true)}
            theme={theme}
          />
          <div className="px-4 py-6 md:px-8 md:py-8">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage query={query} setQuery={setQuery} onSubmit={handleSubmit} theme={theme} user={user} recentReports={recentReports} />} />
              <Route path="/new-research" element={<NewResearchPage query={query} setQuery={setQuery} onSubmit={handleSubmit} theme={theme} user={user} />} />
              <Route path="/research" element={<ResearchPage theme={theme} setRecentReports={setRecentReports} />} />
              <Route path="/report/:id" element={<ResearchReportPage theme={theme} user={user} />} />
              <Route path="/history" element={<HistoryPage theme={theme} />} />
              <Route path="/saved" element={<SavedReportsPage theme={theme} user={user} />} />
              <Route path="/settings" element={<SettingsPage theme={theme} appearance={appearance} setAppearance={setAppearance} user={user} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardPage({ query, setQuery, onSubmit, theme, user, recentReports }) {
  const isDark = theme === 'dark'
  const stats = [
    { label: 'Researches', value: recentReports.length, icon: 'search' },
    { label: 'Verified', value: recentReports.filter((report) => report.status === 'completed').length, icon: 'check' },
    {
      label: 'Average Confidence',
      value: recentReports.length
        ? `${Math.round(recentReports.reduce((total, report) => total + (report.confidence || 0), 0) / recentReports.length)}%`
        : '—',
      icon: 'gauge',
    },
    { label: 'Sources Analyzed', value: recentReports.reduce((total, report) => total + (report.sources?.length || report.source_count || report.metadata?.source_count || 0), 0), icon: 'link' },
  ]
  const activityReports = recentReports.slice(0, 7).reverse().map((report, index) => ({
    id: report.research_id,
    label: report.completed_at?.slice(5, 10) || `R${index + 1}`,
    value: report.sources?.length || report.source_count || report.metadata?.source_count || 0,
  }))
  const maxActivity = Math.max(1, ...activityReports.map((item) => item.value))
  const recentItems = recentReports.map((report) => ({
    id: report.research_id,
    question: report.question,
    sources: report.sources?.length || report.source_count || report.metadata?.source_count || 0,
    claimCount: report.claims?.length || report.claim_count || 0,
    date: report.completed_at ? new Date(report.completed_at).toLocaleDateString() : 'Just now',
    confidence: report.confidence || 0,
    status: report.status === 'completed' ? 'Completed' : 'Insufficient Evidence',
  }))

  return (
    <div className="space-y-8">
      <section className={isDark ? 'rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">Welcome, {user.full_name.split(' ')[0]}</p>
            <h2 className={isDark ? 'mt-2 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl' : 'mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl'}>
              Investigate questions, verify claims, and discover reliable evidence.
            </h2>
          </div>
        </div>

        <ResearchInput value={query} onChange={setQuery} onSubmit={() => onSubmit(query)} examples={exampleQuestions} theme={theme} />
      </section>

      <section aria-labelledby="research-overview-heading">
        <div className="mb-4">
          <h2 id="research-overview-heading" className={isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'}>Your Research Overview</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} theme={theme} />
          ))}
        </div>
      </section>

      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <div className="mb-5">
          <h2 className={isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'}>Research Activity</h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Sources reviewed in your latest investigations</p>
        </div>
        {activityReports.length ? (
          <div className="flex h-32 items-end gap-3 border-b border-slate-200 pb-2">
            {activityReports.map((item) => (
              <div key={item.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className={isDark ? 'w-full max-w-12 rounded-t-md bg-indigo-400/80 transition-all' : 'w-full max-w-12 rounded-t-md bg-indigo-500/80 transition-all'} style={{ height: `${Math.max((item.value / maxActivity) * 88, 4)}%` }} title={`${item.value} sources`} />
                <span className={isDark ? 'text-[10px] text-slate-500' : 'text-[10px] text-slate-400'}>{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={isDark ? 'rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400' : 'rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500'}>Your source activity will appear here after your first report.</p>
        )}
      </section>

      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Recent Research</h2>
            <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Latest investigations and verified results</p>
          </div>
        </div>

        <RecentResearch items={recentItems} onSelect={(id) => window.location.assign(`/report/${id}`)} theme={theme} />
      </section>
    </div>
  )
}

function NewResearchPage({ query, setQuery, onSubmit, theme, user }) {
  const [defaults] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(`verisearchai:preferences:${user.email}`) || '{}')
    } catch {
      return {}
    }
  })
  const [mode, setMode] = useState('deep')
  const [sourceTypes, setSourceTypes] = useState(defaults.preferredSources || ['Web', 'Research Papers', 'News', 'Government / Official Sources'])
  const [depth, setDepth] = useState(defaults.defaultDepth || 'Standard')
  const isDark = theme === 'dark'

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Research workflow</p>
        <h2 className={isDark ? 'mt-1 text-2xl font-semibold text-slate-100' : 'mt-1 text-2xl font-semibold text-slate-900'}>Search, investigate, verify, report.</h2>
      </div>
      <ResearchInput
        value={query}
        onChange={setQuery}
        onSubmit={() => onSubmit(query, { mode, sourceTypes, depth })}
        examples={exampleQuestions}
        theme={theme}
        advanced
        mode={mode}
        onModeChange={setMode}
        sourceTypes={sourceTypes}
        onSourceTypesChange={setSourceTypes}
        depth={depth}
        onDepthChange={setDepth}
      />
    </div>
  )
}

const researchPipeline = [
  { name: 'Understanding research question', status: 'pending' },
  { name: 'Generating search queries', status: 'pending' },
  { name: 'Searching multiple sources', status: 'pending' },
  { name: 'Comparing evidence', status: 'pending' },
  { name: 'Checking source credibility', status: 'pending' },
  { name: 'Detecting conflicting claims', status: 'pending' },
  { name: 'Generating final report', status: 'pending' },
]

function summarizeSourceTypes(sources = []) {
  const counts = { papers: 0, news: 0, official: 0, web: 0 }

  for (const source of sources) {
    const domain = (source.source_name || '').toLowerCase()
    const title = (source.title || '').toLowerCase()
    if (/\.gov(?:\.|$)|\.govt\.|\.int$/.test(domain)) counts.official += 1
    else if (/arxiv|doi\.org|pubmed|nature\.com|science\.org|\.edu$/.test(domain) || /research paper|journal article|study/.test(title)) counts.papers += 1
    else if (/reuters|apnews|bbc\.|cnn\.|npr\.|guardian|nytimes|bloomberg|aljazeera/.test(domain)) counts.news += 1
    else counts.web += 1
  }

  return counts
}

function ResearchPage({ theme, setRecentReports }) {
  const location = useLocation()
  const navigate = useNavigate()
  const question = location.state?.question?.trim() || ''
  const researchOptions = location.state?.options || {}
  const isDark = theme === 'dark'
  const [researchState, setResearchState] = useState(() => ({
    key: location.key,
    progressIndex: 0,
    statusMessage: 'Finding relevant sources...',
    sourceCount: null,
    sourceBreakdown: null,
    error: '',
  }))
  const currentResearchState = researchState.key === location.key
    ? researchState
    : { key: location.key, progressIndex: 0, statusMessage: 'Finding relevant sources...', sourceCount: null, sourceBreakdown: null, error: '' }
  const requestRef = useRef(null)

  useEffect(() => {
    if (!question) {
      navigate('/dashboard', { replace: true })
      return undefined
    }
    if (requestRef.current?.key !== location.key) {
      requestRef.current = {
        key: location.key,
        promise: submitResearch({ question }),
      }
    }

    let isActive = true
    let phaseIndex = 0
    let completionTimer
      const phases = [
        'Understanding research question...',
        'Generating search queries...',
        'Searching multiple sources...',
        'Comparing evidence...',
        'Checking source credibility...',
        'Detecting conflicting claims...',
        'Generating final report...',
      ]
    const phaseTimer = setInterval(() => {
      phaseIndex = Math.min(phaseIndex + 1, phases.length - 1)
      setResearchState({
        key: location.key,
          progressIndex: phaseIndex,
        statusMessage: phases[phaseIndex],
        sourceCount: null,
        sourceBreakdown: null,
        error: '',
      })
    }, 1800)

    requestRef.current.promise
      .then(({ data }) => {
        if (!isActive) return
        clearInterval(phaseTimer)
        setResearchState({
          key: location.key,
          progressIndex: researchPipeline.length,
          statusMessage: 'Research complete',
          sourceCount: data.sources?.length || 0,
          sourceBreakdown: summarizeSourceTypes(data.sources),
          error: '',
        })
        setRecentReports((current) => [data, ...current.filter((report) => report.research_id !== data.research_id)])
        completionTimer = setTimeout(() => {
          if (isActive) navigate(`/report/${data.research_id}`, { replace: true, state: { report: data } })
        }, 450)
      })
      .catch((error) => {
        if (!isActive) return
        clearInterval(phaseTimer)
        setResearchState({
          key: location.key,
            progressIndex: phaseIndex,
          statusMessage: 'Research could not be completed',
          sourceCount: null,
          sourceBreakdown: null,
          error: error.response?.data?.detail || 'Unable to retrieve sources. Please try again.',
        })
      })

    return () => {
      isActive = false
      clearInterval(phaseTimer)
      clearTimeout(completionTimer)
    }
  }, [location.key, navigate, question, setRecentReports])

  const { progressIndex, statusMessage, sourceCount, sourceBreakdown, error: requestError } = currentResearchState
  const steps = researchPipeline.map((step, index) => {
    if (index < progressIndex) return { ...step, status: 'completed' }
    if (index === progressIndex && progressIndex < researchPipeline.length) return { ...step, status: 'in-progress' }
    return { ...step, status: 'pending' }
  })

  const isComplete = statusMessage === 'Research complete'
  const statusLabel = requestError ? 'Failed' : isComplete ? 'Complete' : 'Researching'
  const statusBadge = requestError
    ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30'
    : isComplete
      ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30'
      : 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30'

  return (
    <div className="space-y-8">
      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Research</p>
            <h2 className={isDark ? 'mt-2 text-2xl font-semibold text-slate-100 md:text-3xl' : 'mt-2 text-2xl font-semibold text-slate-900 md:text-3xl'}>Researching your question</h2>
          </div>
          <Button variant="secondary" theme={theme} onClick={() => navigate('/dashboard')} className="hidden sm:inline-flex">
            Back to Dashboard
          </Button>
        </div>

        <div className={isDark ? 'rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-slate-100' : 'rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-slate-800'}>
          <p className={isDark ? 'text-sm text-indigo-300' : 'text-sm text-indigo-700'}>Current question</p>
          <p className="mt-2 text-lg font-medium">{question}</p>
          {researchOptions.mode ? (
            <p className={isDark ? 'mt-3 text-xs text-slate-300' : 'mt-3 text-xs text-slate-600'}>
              {researchOptions.mode.replaceAll('-', ' ')} · {researchOptions.depth} depth · {researchOptions.sourceTypes?.join(', ')}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ResearchProgress steps={steps} theme={theme} />

        <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Status</h3>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge}`}>
              {statusLabel}
            </span>
          </div>

          <div className="space-y-4">
            <div className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-800/80 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500" />
                <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-slate-600'}>{requestError || statusMessage}</p>
              </div>
              <p className={isDark ? 'mt-3 text-2xl font-semibold text-slate-100' : 'mt-3 text-2xl font-semibold text-slate-900'}>
                {sourceCount === null ? 'Collecting evidence' : `${sourceCount} sources found`}
              </p>
            </div>
            <div className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-800/80 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
              <div className="flex items-center gap-3">
                <ShieldCheck className={isDark ? 'h-4 w-4 text-emerald-400' : 'h-4 w-4 text-emerald-600'} />
                <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-slate-600'}>{requestError ? 'Analysis stopped' : isComplete ? 'Evidence verified' : 'Gemini analyzes retrieved source evidence.'}</p>
              </div>
              <p className={isDark ? 'mt-3 text-sm text-slate-400' : 'mt-3 text-sm text-slate-500'}>
                {requestError ? 'No placeholder report will be shown.' : isComplete ? 'Findings have been cross-checked against retrieved sources.' : 'Comparing source reliability and potential contradictions.'}
              </p>
            </div>
            <div className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-800/80 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
              <h4 className={isDark ? 'text-sm font-semibold text-slate-100' : 'text-sm font-semibold text-slate-800'}>Research Activity</h4>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ['Sources discovered', sourceCount],
                  ['Research papers', sourceBreakdown?.papers],
                  ['News sources', sourceBreakdown?.news],
                  ['Official sources', sourceBreakdown?.official],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>{label}</dt>
                    <dd className={isDark ? 'font-medium text-slate-200' : 'font-medium text-slate-700'}>{value ?? '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ResearchReportPage({ theme, user }) {
  const { id } = useParams()
  const location = useLocation()
  const isDark = theme === 'dark'
  const routeReport = location.state?.report?.research_id === id ? location.state.report : null
  const [fetchedResult, setFetchedResult] = useState(null)
  const savedStorageKey = `verisearchai:saved-reports:${user.email}`
  const [savedReports, setSavedReports] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(savedStorageKey) || '[]')
    } catch {
      return []
    }
  })
  const [shareMessage, setShareMessage] = useState('')
  const report = routeReport || (fetchedResult?.id === id ? fetchedResult.report : null)
  const error = fetchedResult?.id === id ? fetchedResult.error : ''
  const isLoading = !report && !error

  useEffect(() => {
    if (routeReport) return undefined

    let isActive = true
    getResearchById(id)
      .then(({ data }) => {
        if (isActive) setFetchedResult({ id, report: data, error: '' })
      })
      .catch((requestError) => {
        if (isActive) setFetchedResult({
          id,
          report: null,
          error: requestError.response?.data?.detail || 'Unable to load this research report.',
        })
      })

    return () => { isActive = false }
  }, [id, routeReport])

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300" role="status">Loading research report...</div>
  }

  if (error || !report) {
    return (
      <EmptyState
        title="Research Not Found"
        description={error || 'No report data was returned for this research request.'}
        actionLabel="Return to Dashboard"
        theme={theme}
        onAction={() => window.location.assign('/dashboard')}
      />
    )
  }

  const claims = report.claims || []
  const sources = report.sources || []
  const contradictions = report.contradictions || []
  const confidence = report.confidence || 0
  const reportDate = report.completed_at ? new Date(report.completed_at).toLocaleString() : 'Just completed'
  const reportStatus = report.status === 'insufficient_evidence'
    ? 'Insufficient Evidence'
    : confidence >= 80
      ? 'Verified'
      : confidence > 0
        ? 'Partially Verified'
        : 'Unverified'
  const isSaved = savedReports.some((item) => item.research_id === report.research_id)

  const toggleSaved = () => {
    const nextSaved = isSaved
      ? savedReports.filter((item) => item.research_id !== report.research_id)
      : [{ ...report, saved_at: new Date().toISOString() }, ...savedReports]
    window.localStorage.setItem(savedStorageKey, JSON.stringify(nextSaved))
    setSavedReports(nextSaved)
  }

  const shareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareMessage('Link copied')
    } catch {
      setShareMessage('Unable to copy link from this browser')
    }
  }

  return (
    <div className="space-y-8">
      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Research Report</p>
            <h2 className={isDark ? 'mt-2 text-3xl font-semibold text-slate-100' : 'mt-2 text-3xl font-semibold text-slate-900'}>{report.question}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <span className={reportStatus === 'Verified' ? 'inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700' : reportStatus === 'Partially Verified' ? 'inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800' : isDark ? 'inline-flex rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300' : 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'}>
              {reportStatus}
            </span>
            <button type="button" onClick={toggleSaved} className={isDark ? 'inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400' : 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-indigo-200'}>
              <Bookmark className="h-3.5 w-3.5" /> {isSaved ? 'Saved' : 'Save Report'}
            </button>
            <button type="button" onClick={() => window.print()} className={isDark ? 'inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400' : 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-indigo-200'}>
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
            <button type="button" onClick={shareReport} className={isDark ? 'inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400' : 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-indigo-200'}>
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <span className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>
              {report.metadata?.processing_time ? `${report.metadata.processing_time}s` : ''}
            </span>
          </div>
        </div>
        {shareMessage ? <p className="mt-3 text-xs text-emerald-500" role="status">{shareMessage}</p> : null}

        <div className={isDark ? 'mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400' : 'mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500'}>
          <span>{sources.length} Sources</span>
          <span>•</span>
          <span>{claims.length} Claims</span>
          <span>•</span>
          <span>{confidence}% Confidence</span>
          <span>•</span>
          <span>{reportDate}</span>
        </div>
      </section>

      <ResearchSummary summary={report.summary} confidence={confidence} theme={theme} />

      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Key Findings</h3>
        {claims.length ? (
          <ul className="mt-4 space-y-3">
            {claims.map((claim, index) => <li key={`${report.research_id}-finding-${index}`} className={isDark ? 'border-l-2 border-indigo-400 pl-3 text-sm leading-6 text-slate-300' : 'border-l-2 border-indigo-500 pl-3 text-sm leading-6 text-slate-700'}>{claim.claim}</li>)}
          </ul>
        ) : <p className={isDark ? 'mt-3 text-sm text-slate-400' : 'mt-3 text-sm text-slate-500'}>No supported findings were returned for this query.</p>}
      </section>

      <section id="sources-evidence" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-slate-900'}>Claim Verification</h3>
        </div>
        {claims.length ? (
          claims.map((item, index) => <ClaimCard key={`${report.research_id}-claim-${index}`} claim={item} theme={theme} />)
        ) : (
          <EmptyState title="No Verified Claims" description="No claim-level findings were captured for this inquiry yet." theme={theme} />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-slate-900'}>Sources & Evidence</h3>
          <div className={isDark ? 'flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300' : 'flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600'}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {['All', 'High Relevance', 'High Credibility', 'Recent', 'Conflicting'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={isDark ? 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 hover:border-indigo-400 hover:text-indigo-300' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sources"
              className={isDark ? 'w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}
            />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {sources.length ? (
            sources.map((source, index) => <SourceCard key={`${report.research_id}-source-${index}`} source={source} theme={theme} />)
          ) : (
            <div className={isDark ? 'rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-8 text-sm text-slate-400' : 'rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500'}>
              No reliable sources were found for this query.
            </div>
          )}
        </div>
      </section>

      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>AI Analysis</h3>
        <pre className={isDark ? 'mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-300' : 'mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700'}>{report.report}</pre>
      </section>

      <section className="space-y-4">
        <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-slate-900'}>Conflicting Evidence</h3>
        {contradictions.length ? contradictions.map((conflict, index) => (
          <ConflictCard key={`${report.research_id}-conflict-${index}`} conflict={conflict} theme={theme} />
        )) : (
          <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300' : 'rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600'}>
            No significant conflicting evidence found.
          </div>
        )}
      </section>
    </div>
  )
}

function HistoryPage({ theme }) {
  const [sortBy, setSortBy] = useState('Newest')
  const [statusFilter, setStatusFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const isDark = theme === 'dark'

  useEffect(() => {
    let isActive = true
    getResearchHistory()
      .then(({ data }) => {
        if (isActive) {
          setItems(data.items.map((item) => ({
            id: item.research_id,
            question: item.question,
            date: item.completed_at || item.created_at || '',
            status: item.status === 'completed' ? 'Completed' : 'Insufficient Evidence',
            sources: item.source_count,
            claims: item.claim_count,
            confidence: item.confidence || 0,
          })))
        }
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.response?.data?.detail || 'Unable to load research history.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => { isActive = false }
  }, [])

  const filteredItems = [...items]
    .filter((item) => item.question.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => statusFilter === 'All'
      || (statusFilter === 'Verified' && item.status === 'Completed' && item.confidence >= 80)
      || (statusFilter === 'Partially Verified' && item.confidence > 0 && item.confidence < 80)
      || (statusFilter === 'Conflicting' && (item.contradiction_count > 0 || item.status === 'Conflicting')))
    .sort((a, b) => {
      if (sortBy === 'Oldest') return a.date.localeCompare(b.date)
      if (sortBy === 'Confidence') return b.confidence - a.confidence
      return b.date.localeCompare(a.date)
    })

  return (
    <div className="space-y-6">
      <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search research history"
              className={isDark ? 'w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Sort by</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className={isDark ? 'rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200" role="alert">{error}</p> : null}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Research history status filter">
          {['All', 'Verified', 'Partially Verified', 'Conflicting'].map((filter) => (
            <button key={filter} type="button" onClick={() => setStatusFilter(filter)} aria-pressed={statusFilter === filter} className={statusFilter === filter ? 'rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white' : isDark ? 'rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300' : 'rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600'}>
              {filter}
            </button>
          ))}
        </div>
        {isLoading ? <p className="text-sm text-slate-400" role="status">Loading research history...</p> : null}
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <div key={item.id} className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm md:p-5' : 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5'}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <h3 className={isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'}>{item.question}</h3>
                  <div className={isDark ? 'flex flex-wrap items-center gap-3 text-sm text-slate-400' : 'flex flex-wrap items-center gap-3 text-sm text-slate-500'}>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className={isDark ? 'grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:min-w-[320px]' : 'grid gap-3 text-sm text-slate-600 sm:grid-cols-3 lg:min-w-[320px]'}>
                  <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Sources:</span> {item.sources}</div>
                  <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Claims:</span> {item.claims}</div>
                  <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Confidence:</span> {item.confidence}%</div>
                </div>

                <Button variant="secondary" theme={theme} onClick={() => window.location.assign(`/report/${item.id}`)} className="lg:shrink-0">
                  View Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No Matching Research" description="Try a broader search term or start a new investigation." theme={theme} />
        )}
      </div>
    </div>
  )
}

function SavedReportsPage({ theme, user }) {
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  const storageKey = `verisearchai:saved-reports:${user.email}`
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || '[]')
    } catch {
      return []
    }
  })
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('Newest')

  const removeReport = (researchId) => {
    const next = reports.filter((report) => report.research_id !== researchId)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
    setReports(next)
  }
  const filteredReports = reports
    .filter((report) => report.question.toLowerCase().includes(query.toLowerCase()))
    .filter((report) => status === 'All'
      || (status === 'Verified' && report.confidence >= 80)
      || (status === 'Partially Verified' && report.confidence > 0 && report.confidence < 80)
      || (status === 'Conflicting' && report.contradictions?.length > 0))
    .sort((a, b) => {
      if (sort === 'Title') return a.question.localeCompare(b.question)
      if (sort === 'Confidence') return b.confidence - a.confidence
      return (b.saved_at || '').localeCompare(a.saved_at || '')
    })

  return (
    <div className="space-y-6">
      <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-4' : 'rounded-2xl border border-slate-200 bg-white p-4'}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved reports" className={isDark ? 'w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500' : 'w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400'} />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Saved report status filter">
            {['All', 'Verified', 'Partially Verified', 'Conflicting'].map((item) => (
              <button key={item} type="button" onClick={() => setStatus(item)} aria-pressed={status === item} className={status === item ? 'rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white' : isDark ? 'rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300' : 'rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600'}>{item}</button>
            ))}
          </div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort saved reports" className={isDark ? 'rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200' : 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'}>
            <option>Newest</option><option>Title</option><option>Confidence</option>
          </select>
        </div>
      </div>
      {filteredReports.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {filteredReports.map((report) => (
            <article key={report.research_id} className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5' : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={isDark ? 'text-xs font-medium uppercase tracking-wide text-indigo-300' : 'text-xs font-medium uppercase tracking-wide text-indigo-600'}>{report.status === 'insufficient_evidence' || report.confidence === 0 ? 'Unverified' : report.confidence >= 80 ? 'Verified' : 'Partially Verified'}</p>
                  <h3 className={isDark ? 'mt-2 text-base font-semibold text-slate-100' : 'mt-2 text-base font-semibold text-slate-900'}>{report.question}</h3>
                </div>
                <span className={isDark ? 'shrink-0 text-sm font-semibold text-slate-200' : 'shrink-0 text-sm font-semibold text-slate-700'}>{report.confidence}%</span>
              </div>
              <p className={isDark ? 'mt-3 line-clamp-2 text-sm leading-6 text-slate-400' : 'mt-3 line-clamp-2 text-sm leading-6 text-slate-600'}>{report.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className={isDark ? 'text-xs text-slate-500' : 'text-xs text-slate-500'}>{report.sources?.length || 0} sources · {report.saved_at?.slice(0, 10) || ''}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => navigate(`/report/${report.research_id}`, { state: { report } })} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500">Open Report <ArrowUpRight className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => removeReport(report.research_id)} aria-label="Remove saved report" title="Remove saved report" className={isDark ? 'rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-300' : 'rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600'}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title={reports.length ? 'No Matching Reports' : 'No Saved Reports'} description={reports.length ? 'Adjust your search or filters.' : 'Save a research report to find it here.'} theme={theme} />
      )}
    </div>
  )
}

function SettingsPage({ theme, appearance: selectedAppearance, setAppearance, user }) {
  const isDark = theme === 'dark'
  const storageKey = `verisearchai:preferences:${user.email}`
  const [preferences, setPreferences] = useState(() => {
    try {
      return {
        defaultDepth: 'Standard',
        preferredSources: ['Web', 'Research Papers', 'News', 'Government / Official Sources'],
        citationStyle: 'APA',
        notifications: { researchCompleted: true, reportReady: true },
        ...JSON.parse(window.localStorage.getItem(storageKey) || '{}'),
      }
    } catch {
      return {
        defaultDepth: 'Standard',
        preferredSources: ['Web', 'Research Papers', 'News', 'Government / Official Sources'],
        citationStyle: 'APA',
        notifications: { researchCompleted: true, reportReady: true },
      }
    }
  })

  const updatePreferences = (changes) => {
    const next = { ...preferences, ...changes }
    setPreferences(next)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  }
  const selectAppearance = (nextAppearance) => {
    setAppearance(nextAppearance)
    updatePreferences({ appearance: nextAppearance })
  }
  const toggleNotification = (name) => {
    updatePreferences({ notifications: { ...preferences.notifications, [name]: !preferences.notifications[name] } })
  }
  const panel = isDark
    ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6'
    : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'
  const heading = isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'
  const muted = isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'
  const select = isDark
    ? 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20'
    : 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'

  return (
    <div className="space-y-6">
      <section className={panel}>
        <h2 className={heading}>Account</h2>
        <div className={isDark ? 'mt-4 flex flex-col gap-1 border-t border-slate-800 pt-4 text-sm' : 'mt-4 flex flex-col gap-1 border-t border-slate-100 pt-4 text-sm'}>
          <span className={isDark ? 'font-medium text-slate-100' : 'font-medium text-slate-900'}>{user.full_name}</span>
          <span className={muted}>{user.email}</span>
        </div>
      </section>

      <section className={panel}>
        <h2 className={heading}>Research Preferences</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={isDark ? 'block text-sm font-medium text-slate-300' : 'block text-sm font-medium text-slate-700'}>
            Default Research Depth
            <select value={preferences.defaultDepth} onChange={(event) => updatePreferences({ defaultDepth: event.target.value })} className={`${select} mt-2`}>
              <option>Quick</option><option>Standard</option><option>Deep</option>
            </select>
          </label>
          <label className={isDark ? 'block text-sm font-medium text-slate-300' : 'block text-sm font-medium text-slate-700'}>
            Citation Style
            <select value={preferences.citationStyle} onChange={(event) => updatePreferences({ citationStyle: event.target.value })} className={`${select} mt-2`}>
              <option>APA</option><option>MLA</option><option>Chicago</option><option>IEEE</option>
            </select>
          </label>
        </div>
        <div className="mt-5">
          <p className={isDark ? 'mb-3 text-sm font-medium text-slate-300' : 'mb-3 text-sm font-medium text-slate-700'}>Preferred Sources</p>
          <div className="flex flex-wrap gap-2">
            {['Web', 'Research Papers', 'News', 'Government / Official Sources'].map((source) => {
              const checked = preferences.preferredSources.includes(source)
              return <button key={source} type="button" role="checkbox" aria-checked={checked} onClick={() => updatePreferences({ preferredSources: checked ? preferences.preferredSources.filter((item) => item !== source) : [...preferences.preferredSources, source] })} className={checked ? isDark ? 'rounded-full border border-indigo-400/50 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-200' : 'rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700' : isDark ? 'rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-400' : 'rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600'}>{source}</button>
            })}
          </div>
        </div>
      </section>

      <section className={panel}>
        <h2 className={heading}>Appearance</h2>
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Appearance">
          {['Light', 'System', 'Dark'].map((appearance) => (
            <button key={appearance} type="button" role="radio" aria-checked={selectedAppearance === appearance} onClick={() => selectAppearance(appearance)} className={selectedAppearance === appearance ? 'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white' : isDark ? 'rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-indigo-400' : 'rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-indigo-200'}>{appearance}</button>
          ))}
        </div>
      </section>

      <section className={panel}>
        <h2 className={heading}>Notifications</h2>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
          {[
            ['researchCompleted', 'Research Completed', 'Notify when an investigation finishes.'],
            ['reportReady', 'Report Ready', 'Notify when the full report is available.'],
          ].map(([key, label, description]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <span>
                <span className={isDark ? 'block text-sm font-medium text-slate-200' : 'block text-sm font-medium text-slate-800'}>{label}</span>
                <span className={muted}>{description}</span>
              </span>
              <input type="checkbox" checked={preferences.notifications[key]} onChange={() => toggleNotification(key)} className="h-4 w-4 accent-indigo-600" />
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
