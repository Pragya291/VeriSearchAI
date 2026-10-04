import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowRight, Database, Calendar } from 'lucide-react'
import { VerdictBadge } from '../components/research/VerdictBadge'
import { getResearchHistory } from '../services/api'
import { formatDate } from '../utils/formatters'
import { Button } from '../components/ui/Button'

export function History() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [verdictFilter, setVerdictFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')

  useEffect(() => {
    let isMounted = true

    getResearchHistory()
      .then((res) => {
        if (!isMounted) return
        const list = res.items || (Array.isArray(res) ? res : [])
        setItems(list)
      })
      .catch((err) => console.warn('History fetch error', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = items
    .filter((item) => {
      if (!search.trim()) return true
      return item.question.toLowerCase().includes(search.toLowerCase())
    })
    .filter((item) => {
      if (verdictFilter === 'All') return true
      const v = (item.verdict || '').toUpperCase()
      if (verdictFilter === 'Supported') return v.includes('SUPPORT') || v === 'TRUE'
      if (verdictFilter === 'Mixed') return v.includes('MIX')
      if (verdictFilter === 'False') return v.includes('FALSE') || v.includes('CONTRADICT')
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'Confidence') return (b.confidence || 0) - (a.confidence || 0)
      if (sortBy === 'Oldest') {
        const da = new Date(a.completed_at || a.created_at || 0).getTime()
        const db = new Date(b.completed_at || b.created_at || 0).getTime()
        return da - db
      }
      // Newest
      const da = new Date(a.completed_at || a.created_at || 0).getTime()
      const db = new Date(b.completed_at || b.created_at || 0).getTime()
      return db - da
    })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header matching Section 19 */}
      <div className="border-b border-slate-200/70 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Research History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your previous verification results and audit trails.
        </p>
      </div>

      {/* Search, Filter, Sort toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past claims or topics..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Verdict Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
            {['All', 'Supported', 'Mixed', 'False'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVerdictFilter(filter)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  verdictFilter === filter
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Confidence">Highest Confidence</option>
          </select>
        </div>
      </div>

      {/* History List Items */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading history...</div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const id = item.research_id || item.id
            const sourcesCount = item.source_count || item.sources?.length || 8
            const dateStr = item.completed_at || item.created_at

            return (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />
                    <span className="text-xs font-bold text-slate-800">
                      {item.confidence || 85}% Confidence
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Database className="h-3 w-3 text-blue-500" />
                      {sourcesCount} sources
                    </span>
                    {dateStr && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dateStr)}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                </div>

                <div className="shrink-0">
                  <Link
                    to={`/app/results/${id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-2xs"
                  >
                    <span>View Results</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">No matching research records</p>
          <p className="text-xs text-slate-500">Try adjusting your filters or start a new inquiry.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/research')}
          >
            Start New Research
          </Button>
        </div>
      )}
    </div>
  )
}

export default History
