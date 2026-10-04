import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react'

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
import { exampleQuestions, historyEntries, recentResearch, savedReports, stats } from './data/mockData'

function App() {
  const [query, setQuery] = useState(exampleQuestions[0])
  const [theme, setTheme] = useState('dark')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <AppShell
        query={query}
        setQuery={setQuery}
        theme={theme}
        setTheme={setTheme}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </BrowserRouter>
  )
}

function AppShell({ query, setQuery, theme, setTheme, menuOpen, setMenuOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isDark = theme === 'dark'

  const pageMeta = useMemo(() => {
    if (location.pathname === '/history') {
      return { title: 'Research History', subtitle: 'Track evidence, results, and trust signals across all investigations.' }
    }

    if (location.pathname === '/saved') {
      return { title: 'Saved Reports', subtitle: 'Pinned analyses you want to revisit and compare.' }
    }

    if (location.pathname === '/settings') {
      return { title: 'Settings', subtitle: 'Customize analysis preferences and research defaults.' }
    }

    if (location.pathname === '/research') {
      return { title: 'Researching your question', subtitle: 'Monitoring search, evidence collection, and source analysis.' }
    }

    if (location.pathname.startsWith('/report')) {
      return { title: 'Research Report', subtitle: 'Evidence-backed conclusions and source verification.' }
    }

    return { title: 'Autonomous Research', subtitle: 'Investigate questions, verify claims, and discover reliable evidence.' }
  }, [location.pathname])

  const handleSubmit = () => {
    const nextQuestion = query.trim() || exampleQuestions[0]
    setQuery(nextQuestion)
    navigate('/research', { state: { question: nextQuestion } })
  }

  return (
    <div className={isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}>
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
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
              <Route path="/" element={<DashboardPage query={query} setQuery={setQuery} onSubmit={handleSubmit} theme={theme} />} />
              <Route path="/research" element={<ResearchPage theme={theme} />} />
              <Route path="/report/:id" element={<ResearchReportPage theme={theme} />} />
              <Route path="/history" element={<HistoryPage theme={theme} />} />
              <Route path="/saved" element={<SavedReportsPage theme={theme} />} />
              <Route path="/settings" element={<SettingsPage theme={theme} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardPage({ query, setQuery, onSubmit, theme }) {
  const isDark = theme === 'dark'

  return (
    <div className="space-y-8">
      <section className={isDark ? 'rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">Autonomous Research</p>
            <h2 className={isDark ? 'mt-2 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl' : 'mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl'}>
              Investigate questions, verify claims, and discover reliable evidence.
            </h2>
          </div>
        </div>

        <ResearchInput value={query} onChange={setQuery} onSubmit={onSubmit} examples={exampleQuestions} theme={theme} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} theme={theme} />
        ))}
      </section>

      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Recent Research</h2>
            <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Latest investigations and verified results</p>
          </div>
        </div>

        <RecentResearch items={recentResearch} onSelect={(id) => window.location.assign(`/report/${id}`)} theme={theme} />
      </section>
    </div>
  )
}

const researchPipeline = [
  { name: 'Searching the Web', status: 'completed' },
  { name: 'Collecting Evidence', status: 'completed' },
  { name: 'Analyzing Sources', status: 'in-progress' },
  { name: 'Comparing Claims', status: 'pending' },
  { name: 'Fact Checking', status: 'pending' },
  { name: 'Generating Report', status: 'pending' },
]

function ResearchPage({ theme }) {
  const location = useLocation()
  const navigate = useNavigate()
  const question = location.state?.question || 'Is electric vehicle adoption increasing worldwide?'
  const isDark = theme === 'dark'
  const [progressIndex, setProgressIndex] = useState(2)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) return undefined

    const timer = setTimeout(() => {
      setProgressIndex((current) => {
        if (current >= researchPipeline.length - 1) {
          setIsComplete(true)
          return current
        }

        return current + 1
      })
    }, 1200)

    return () => clearTimeout(timer)
  }, [isComplete, progressIndex])

  useEffect(() => {
    if (!isComplete) return undefined

    const timer = setTimeout(() => {
      navigate('/report/ev-1')
    }, 1800)

    return () => clearTimeout(timer)
  }, [isComplete, navigate])

  const steps = researchPipeline.map((step, index) => {
    if (index < progressIndex) return { ...step, status: 'completed' }
    if (index === progressIndex) return { ...step, status: 'in-progress' }
    return { ...step, status: 'pending' }
  })

  const statusLabel = isComplete ? 'Complete' : 'Researching'
  const statusBadge = isComplete
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
          <Button variant="secondary" onClick={() => navigate('/')} className="hidden sm:inline-flex">
            Back to Dashboard
          </Button>
        </div>

        <div className={isDark ? 'rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-slate-100' : 'rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-slate-800'}>
          <p className={isDark ? 'text-sm text-indigo-300' : 'text-sm text-indigo-700'}>Current question</p>
          <p className="mt-2 text-lg font-medium">{question}</p>
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
                <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-slate-600'}>{isComplete ? 'Finalizing findings...' : 'Searching sources...'}</p>
              </div>
              <p className={isDark ? 'mt-3 text-2xl font-semibold text-slate-100' : 'mt-3 text-2xl font-semibold text-slate-900'}>{isComplete ? 'Report ready' : '12 sources found'}</p>
            </div>
            <div className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-800/80 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
              <div className="flex items-center gap-3">
                <ShieldCheck className={isDark ? 'h-4 w-4 text-emerald-400' : 'h-4 w-4 text-emerald-600'} />
                <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-slate-600'}>{isComplete ? 'Evidence verified' : 'Analyzing evidence...'}</p>
              </div>
              <p className={isDark ? 'mt-3 text-sm text-slate-400' : 'mt-3 text-sm text-slate-500'}>{isComplete ? 'Our findings have been cross-checked across the strongest evidence sources.' : 'Comparing source reliability and contradiction patterns.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ResearchReportPage({ theme }) {
  const { id } = useParams()
  const isDark = theme === 'dark'
  const report = recentResearch.find((item) => item.id === id) || recentResearch[0]

  if (!report) {
    return (
      <EmptyState
        title="Research Not Found"
        description="The requested report is not available right now. Try returning to the dashboard and selecting another analysis."
        actionLabel="Return Home"
        onAction={() => window.location.assign('/')}
      />
    )
  }

  return (
    <div className="space-y-8">
      <section className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Research Report</p>
            <h2 className={isDark ? 'mt-2 text-3xl font-semibold text-slate-100' : 'mt-2 text-3xl font-semibold text-slate-900'}>{report.question}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Completed
            </span>
            <span className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>{report.processingTime}</span>
          </div>
        </div>

        <div className={isDark ? 'mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400' : 'mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500'}>
          <span>{report.sources} Sources</span>
          <span>•</span>
          <span>{report.claimCount ?? report.claims?.length ?? 0} Claims</span>
          <span>•</span>
          <span>{report.confidence}% Confidence</span>
          <span>•</span>
          <span>{report.date}</span>
        </div>
      </section>

      <ResearchSummary summary={report.summary} confidence={report.confidence} theme={theme} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-slate-900'}>Claim Verification</h3>
        </div>
        {report.claims?.length ? (
          report.claims.map((item) => <ClaimCard key={item.id} claim={item} theme={theme} />)
        ) : (
          <EmptyState title="No Verified Claims" description="No claim-level findings were captured for this inquiry yet." />
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
          {report.sourcesData?.length ? (
            report.sourcesData.map((source) => <SourceCard key={source.id} source={source} theme={theme} />)
          ) : (
            <div className={isDark ? 'rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-8 text-sm text-slate-400' : 'rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500'}>
              No source cards available yet for this research item.
            </div>
          )}
        </div>
      </section>

      {report.contradictions?.length ? (
        <section className="space-y-4">
          <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-slate-900'}>Conflicting Evidence</h3>
          {report.contradictions.map((conflict) => (
            <ConflictCard key={conflict.id} conflict={conflict} theme={theme} />
          ))}
        </section>
      ) : null}
    </div>
  )
}

function HistoryPage({ theme }) {
  const [sortBy, setSortBy] = useState('Newest')
  const [query, setQuery] = useState('')
  const isDark = theme === 'dark'

  const filteredItems = [...historyEntries]
    .filter((item) => item.question.toLowerCase().includes(query.toLowerCase()))
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

      <div className="space-y-3">
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

                <Button variant="secondary" onClick={() => window.location.assign(`/report/${item.id}`)} className="lg:shrink-0">
                  View Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No Matching Research" description="Try a broader search term or start a new investigation." />
        )}
      </div>
    </div>
  )
}

function SavedReportsPage({ theme }) {
  const isDark = theme === 'dark'

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {savedReports.map((report) => (
        <div key={report.id} className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Saved Report</p>
              <h3 className={isDark ? 'mt-2 text-xl font-semibold text-slate-100' : 'mt-2 text-xl font-semibold text-slate-900'}>{report.question}</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{report.confidence}%</span>
          </div>

          <p className={isDark ? 'mt-4 text-sm text-slate-400' : 'mt-4 text-sm text-slate-500'}>{report.date}</p>
          <p className={isDark ? 'mt-3 text-sm leading-6 text-slate-300' : 'mt-3 text-sm leading-6 text-slate-700'}>{report.summary}</p>

          <div className={isDark ? 'mt-5 flex items-center justify-between gap-3 text-sm text-slate-400' : 'mt-5 flex items-center justify-between gap-3 text-sm text-slate-500'}>
            <span>{report.sources} Sources</span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => window.location.assign(`/report/${report.id}`)}>
                View
              </Button>
              <Button variant="danger">Delete</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SettingsPage({ theme }) {
  const isDark = theme === 'dark'

  return (
    <div className="space-y-6">
      <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Appearance</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button type="button" className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left hover:border-indigo-400' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-indigo-200'}>
            <p className={isDark ? 'font-medium text-slate-100' : 'font-medium text-slate-900'}>Light mode</p>
            <p className={isDark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-500'}>Default workspace presentation</p>
          </button>
          <button type="button" className={isDark ? 'rounded-2xl border border-indigo-500/40 bg-slate-800 p-4 text-left text-white hover:border-indigo-300' : 'rounded-2xl border border-slate-200 bg-slate-900 p-4 text-left text-white hover:border-indigo-300'}>
            <p className="font-medium">Dark mode</p>
            <p className="mt-1 text-sm text-slate-300">Lower-glare analysis environment</p>
          </button>
        </div>
      </div>

      <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Research Preferences</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className={isDark ? 'block text-sm text-slate-300' : 'block text-sm text-slate-600'}>
            <span className={isDark ? 'mb-2 block font-medium text-slate-200' : 'mb-2 block font-medium text-slate-700'}>Number of sources</span>
            <select className={isDark ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}>
              <option>8</option>
              <option selected>12</option>
              <option>20</option>
            </select>
          </label>

          <label className={isDark ? 'block text-sm text-slate-300' : 'block text-sm text-slate-600'}>
            <span className={isDark ? 'mb-2 block font-medium text-slate-200' : 'mb-2 block font-medium text-slate-700'}>Search depth</span>
            <select className={isDark ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}>
              <option>Balanced</option>
              <option selected>Deep</option>
              <option>Focused</option>
            </select>
          </label>

          <label className={isDark ? 'block text-sm text-slate-300' : 'block text-sm text-slate-600'}>
            <span className={isDark ? 'mb-2 block font-medium text-slate-200' : 'mb-2 block font-medium text-slate-700'}>Preferred research style</span>
            <select className={isDark ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}>
              <option selected>Evidence first</option>
              <option>Analytical</option>
              <option>Fast summary</option>
            </select>
          </label>
        </div>
      </div>

      <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Account</h3>
        <div className={isDark ? 'mt-4 space-y-3 text-sm text-slate-300' : 'mt-4 space-y-3 text-sm text-slate-600'}>
          <div className={isDark ? 'rounded-2xl border border-slate-700 bg-slate-950 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Profile</p>
            <p className={isDark ? 'mt-1 font-medium text-slate-100' : 'mt-1 font-medium text-slate-900'}>Janahvi Loke</p>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Research Lead</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
