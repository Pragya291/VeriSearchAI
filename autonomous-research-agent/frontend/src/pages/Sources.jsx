import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, Award, Globe, Database, Calendar } from 'lucide-react'
import { getSources } from '../services/api'
import { formatDate, extractDomain } from '../utils/formatters'
import { Badge } from '../components/ui/Badge'

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
        if (isMounted) setSources(data)
      })
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
        (s.snippet || '').toLowerCase().includes(q)
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-slate-200/70 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Evaluated Sources
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Independent publications, academic archives, and official public registries evaluated by VeriSearchAI.
        </p>
      </div>

      {/* Filter and Search Bar matching Section 18 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain, title, or keywords..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5 border border-slate-200/60 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === cat
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="Relevance">Sort: Relevance</option>
            <option value="Newest">Sort: Newest</option>
            <option value="Credibility">Sort: Credibility</option>
          </select>
        </div>
      </div>

      {/* Desktop: Table layout / Mobile: Cards layout (matching Section 18) */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading sources...</div>
      ) : filteredSources.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Source & Domain</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Credibility</th>
                  <th className="py-3.5 px-4">Relevance</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSources.map((source, idx) => {
                  const domain = source.source_name || extractDomain(source.url)
                  const relevance = Math.round((source.relevance_score || 0.85) * 100)
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 max-w-sm">
                        <div className="font-semibold text-slate-900 leading-snug line-clamp-1">
                          {source.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{domain}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {source.source_type || 'Web'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={source.credibility_score === 'High' ? 'green' : 'amber'}
                          size="sm"
                          icon={Award}
                        >
                          {source.credibility_score || 'High'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-600">
                        {relevance}%
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(source.published_date)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Layout */}
          <div className="md:hidden space-y-3">
            {filteredSources.map((source, idx) => {
              const domain = source.source_name || extractDomain(source.url)
              const relevance = Math.round((source.relevance_score || 0.85) * 100)
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                        {source.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{domain}</p>
                    </div>
                    <span className="font-bold text-xs text-blue-600 shrink-0">
                      {relevance}% match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <Badge
                      variant={source.credibility_score === 'High' ? 'green' : 'amber'}
                      size="sm"
                    >
                      {source.credibility_score || 'High'}
                    </Badge>

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                      >
                        <span>Visit Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No sources match your current search and filter settings.
        </div>
      )}
    </div>
  )
}

export default Sources
