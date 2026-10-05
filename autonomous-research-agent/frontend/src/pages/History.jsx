import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  ArrowRight,
  Database,
  Calendar,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { VerdictBadge } from '../components/research/VerdictBadge'
import { getResearchHistory } from '../services/api'
import { formatDate } from '../utils/formatters'

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

  // Dynamic search and filter
  const filteredItems = items
    .filter((item) => {
      if (!search.trim()) return true
      const query = search.toLowerCase()
      const qMatches = (item.question || '').toLowerCase().includes(query)
      const vMatches = (item.verdict || '').toLowerCase().includes(query)
      const sMatches = (item.summary || '').toLowerCase().includes(query)
      return qMatches || vMatches || sMatches
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
      if (sortBy === 'Sources') {
        const sa = a.source_count || (a.sources ? a.sources.length : 0) || 0
        const sb = b.source_count || (b.sources ? b.sources.length : 0) || 0
        return sb - sa
      }
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

  const filterTabs = [
    { id: 'All', label: 'All' },
    { id: 'Supported', label: 'Supported' },
    { id: 'Mixed', label: 'Mixed' },
    { id: 'False', label: 'False' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Page Header matching Reference Image */}
      <div>
        <h1 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold tracking-tight text-slate-900 leading-tight">
          Research History
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-normal">
          Review your previous verification results and audit trails.
        </p>
      </div>

      {/* 2. Unified Search & Filter Toolbar */}
      <div className="rounded-2xl lg:rounded-[22px] border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        {/* Search Input Field */}
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past claims or topics..."
            className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] py-2 pl-9.5 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Filter research by verdict">
            {filterTabs.map((tab) => {
              const isSelected = verdictFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setVerdictFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort research history"
              className="appearance-none cursor-pointer rounded-xl border border-slate-200/80 bg-white py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Confidence">Highest Confidence</option>
              <option value="Sources">Most Sources</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* 3. Research History Cards List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl lg:rounded-[22px] border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
                <div className="h-4 w-28 bg-slate-100 rounded-md" />
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
              </div>
              <div className="h-6 w-3/4 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-3.5 sm:space-y-4">
          {filteredItems.map((item) => {
            const id = item.research_id || item.id
            const sourcesCount =
              item.source_count || (item.sources ? item.sources.length : 0) || 10
            const dateStr = item.completed_at || item.created_at

            return (
              <div
                key={id}
                className="group relative rounded-2xl lg:rounded-[22px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-200"
              >
                {/* Top Metadata Row: Status Badge + Confidence + Sources + Date */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* Status Badge */}
                  <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />

                  {/* Confidence Metric */}
                  <div className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">
                      {item.confidence || 85}% Confidence
                    </span>
                  </div>

                  {/* Separator dot */}
                  <span className="text-slate-300 select-none">•</span>

                  {/* Sources Count */}
                  <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                    <Database className="h-3.5 w-3.5 text-[#3B82F6]" />
                    <span>{sourcesCount} sources</span>
                  </div>

                  {/* Date */}
                  {dateStr && (
                    <>
                      <span className="text-slate-300 select-none">•</span>
                      <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDate(dateStr)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Main Row: Research Question & View Results Action */}
                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-base sm:text-[18px] lg:text-[19px] font-bold text-slate-900 leading-snug tracking-tight min-w-0 pr-2">
                    {item.question}
                  </h3>

                  <div className="shrink-0">
                    <Link
                      to={`/app/results/${id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-150 group/btn cursor-pointer"
                    >
                      <span>View Results</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty / No Results State */
        <div className="rounded-2xl lg:rounded-[22px] border border-dashed border-slate-200 bg-white p-10 sm:p-14 text-center space-y-3 shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching research records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? `No previous verification records matched "${search}". Try adjusting your keywords or clearing the filter.`
              : `No ${verdictFilter.toLowerCase()} evidence records currently available.`}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2.5">
            {(search || verdictFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setVerdictFilter('All')
                }}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/app/research')}
              className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Start New Research
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
