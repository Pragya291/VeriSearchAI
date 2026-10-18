import { useState, useEffect } from 'react'
import { Search, X, FileText, CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react'
import { getSources } from '../services/api'
import { formatDate, extractDomain } from '../utils/formatters'

export function Sources() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [sortBy, setSortBy] = useState('Relevance')

  useEffect(() => {
    let isMounted = true
    getSources('All')
      .then((data) => {
        if (isMounted) setSources(data || [])
      })
      .catch((err) => console.warn('Sources fetch error', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const categories = ['All', 'Academic', 'Government', 'News', 'Research Paper']

  const filteredSources = sources
    .filter((s) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (s.title || '').toLowerCase().includes(q) ||
        (s.source_name || '').toLowerCase().includes(q) ||
        (s.snippet || '').toLowerCase().includes(q) ||
        (s.source_type || '').toLowerCase().includes(q)
      )
    })
    .filter((s) => {
      if (filterType === 'All') return true
      return (s.source_type || '').toLowerCase() === filterType.toLowerCase()
    })
    .sort((a, b) => {
      if (sortBy === 'Credibility') {
        const scoreA = a.credibility_score === 'High' ? 3 : a.credibility_score === 'Medium' ? 2 : 1
        const scoreB = b.credibility_score === 'High' ? 3 : b.credibility_score === 'Medium' ? 2 : 1
        return scoreB - scoreA
      }
      if (sortBy === 'Newest') {
        const da = new Date(a.published_date || 0).getTime()
        const db = new Date(b.published_date || 0).getTime()
        return db - da
      }
      // Relevance
      return (b.relevance_score || 0) - (a.relevance_score || 0)
    })

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          Evaluated Sources
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
          Independent publications, academic archives, and official public registries evaluated by VeriSearchAI.
        </p>
      </div>

      {/* 2. Compact Search & Filter Toolbar */}
      <div className="rounded-xl lg:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain, title, or keywords..."
            className="w-full rounded-lg border border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/80 py-1.5 pl-8 pr-7 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Filter sources by category">
            {categories.map((cat) => {
              const isSelected = filterType === cat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFilterType(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-2xs'
                      : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Sort Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort evaluated sources"
              className="appearance-none cursor-pointer rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800 py-1 pl-2.5 pr-7 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all shadow-2xs"
            >
              <option value="Relevance">Sort: Relevance</option>
              <option value="Newest">Sort: Newest</option>
              <option value="Credibility">Sort: Credibility</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* 3. Compact Evaluated Sources Table Card */}
      <div className="rounded-xl lg:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 animate-pulse">Loading evaluated sources...</div>
        ) : filteredSources.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-[42%]">SOURCE &amp; DOMAIN</th>
                  <th className="py-2.5 px-3">CATEGORY</th>
                  <th className="py-2.5 px-3">CREDIBILITY</th>
                  <th className="py-2.5 px-3">RELEVANCE</th>
                  <th className="py-2.5 px-3">DATE</th>
                  <th className="py-2.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/90 dark:divide-slate-800">
                {filteredSources.map((source, idx) => {
                  const domain = source.source_name || extractDomain(source.url)
                  const relevance = Math.round((source.relevance_score || 0.85) * 100)

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* SOURCE & DOMAIN */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:border-blue-200 dark:group-hover:border-blue-800 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:bg-blue-50/40 dark:group-hover:bg-blue-950/40 transition-colors">
                            <FileText className="h-3.5 w-3.5 stroke-[1.75]" />
                          </div>
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 text-xs sm:text-[13px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {source.title}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                              {domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {source.source_type || 'Academic'}
                      </td>

                      {/* CREDIBILITY */}
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#A7F3D0] dark:border-emerald-800/60 bg-[#E8F8F0] dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-[#059669] dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                          <span>{source.credibility_score || 'High'}</span>
                        </span>
                      </td>

                      {/* RELEVANCE */}
                      <td className="py-2.5 px-3 font-bold text-[#2563EB] dark:text-blue-400 text-xs sm:text-[13.5px]">
                        {relevance}%
                      </td>

                      {/* DATE */}
                      <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                        {formatDate(source.published_date)}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-2.5 px-4 text-right">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-colors group/link cursor-pointer"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover/link:translate-x-0.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300 dark:text-slate-700">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No sources match your search or filter criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default Sources
