import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { ResearchInput } from '../components/research/ResearchInput'
import { StatCard } from '../components/dashboard/StatCard'
import { ActivityChart } from '../components/dashboard/ActivityChart'
import { RecentResearch } from '../components/dashboard/RecentResearch'
import { getResearchHistory } from '../services/api'
import { useAuth } from '../auth/useAuth'

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [recentReports, setRecentReports] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    let isMounted = true

    getResearchHistory()
      .then((res) => {
        if (!isMounted) return
        const list = res.items || (Array.isArray(res) ? res : [])
        setRecentReports(list)
      })
      .catch((err) => {
        console.warn('Could not load history on dashboard', err)
      })
      .finally(() => {
        if (isMounted) setLoadingHistory(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleStartVerification = ({ question, depth, sourceType }) => {
    if (!question) return
    navigate('/app/research', {
      state: { question, depth, sourceType },
    })
  }

  // Calculate real statistics from recentReports
  const totalResearches = recentReports.length
  const claimsVerified = recentReports.reduce((acc, r) => acc + (r.claim_count || 1), 0)
  const avgConfidence = recentReports.length > 0 
    ? `${Math.round(recentReports.reduce((acc, r) => acc + (r.confidence || 0), 0) / recentReports.length)}%` 
    : '0%'
  const sourcesAnalyzed = recentReports.reduce((acc, r) => acc + (r.source_count || 0), 0)

  // Calculate chart data for ActivityChart (Mon-Sun)
  const chartData = [
    { label: 'Mon', sources: 0 },
    { label: 'Tue', sources: 0 },
    { label: 'Wed', sources: 0 },
    { label: 'Thu', sources: 0 },
    { label: 'Fri', sources: 0 },
    { label: 'Sat', sources: 0 },
    { label: 'Sun', sources: 0 },
  ]
  
  recentReports.forEach(r => {
    const d = new Date(r.completed_at || r.created_at || Date.now())
    const day = (d.getDay() + 6) % 7 // Convert Sun=0 to Mon=0
    chartData[day].sources += (r.source_count || 0)
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header matching Section 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Research Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
              <Sparkles className="h-3 w-3" />
              Autonomous
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Investigate claims and discover what the evidence says.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Logged in as <strong className="text-slate-700">{user?.full_name || 'Dr. Alex Bennett'}</strong>
        </div>
      </div>

      {/* Section 9: Primary Research Input Card */}
      <ResearchInput
        value={query}
        onChange={setQuery}
        onSubmit={handleStartVerification}
      />

      {/* Section 22: Dashboard Analytics Stat Cards */}
      <section aria-labelledby="analytics-heading">
        <h2 id="analytics-heading" className="sr-only">
          Dashboard Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Research Completed"
            value={totalResearches}
            icon="search"
            change="+4 this week"
          />
          <StatCard
            label="Claims Verified"
            value={claimsVerified}
            icon="compass"
            change="+12% vs last month"
          />
          <StatCard
            label="Average Confidence"
            value={avgConfidence}
            icon="shield"
          />
          <StatCard
            label="Sources Analyzed"
            value={sourcesAnalyzed}
            icon="link"
            change="+32 new sources"
          />
        </div>
      </section>

      {/* Research Activity Chart */}
      <ActivityChart data={chartData} />

      {/* Recent Research Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Research</h3>
            <p className="text-xs text-slate-500">
              Latest investigations and evidence-backed conclusions
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/app/history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View All History →
          </button>
        </div>

        <RecentResearch items={recentReports.slice(0, 5)} />
      </section>
    </div>
  )
}

export default Dashboard
