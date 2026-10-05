import { useState } from 'react'
import {
  ExternalLink,
  Globe,
  Calendar,
  Award,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Search,
} from 'lucide-react'
import { formatDate, extractDomain } from '../../utils/formatters'
import { Modal } from '../ui/Modal'

export function SourcesList({
  sources = [],
  className = '',
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState(null)

  const filteredSources = sources.filter((s) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const title = (s.title || '').toLowerCase()
    const domain = (s.source_name || extractDomain(s.url) || '').toLowerCase()
    return title.includes(term) || domain.includes(term)
  })

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Tab Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Link2 className="h-5 w-5 text-[#2563EB]" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              All Evaluated Sources ({sources.length})
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Cross-referenced academic repositories, institutional registries, and peer-reviewed journals
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter sources or domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200/90 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {filteredSources.length === 0 ? (
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center text-sm text-slate-500">
          No sources match your search criteria.
        </div>
      ) : (
        <div className="rounded-[20px] border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC]/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 sm:px-5">Source & Title</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Relevance</th>
                  <th className="py-3 px-4">Credibility</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Open Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSources.map((source, idx) => {
                  const domain = source.source_name || extractDomain(source.url)
                  const isSupporting = source.supports_claim !== false && !source.conflict_explanation
                  const relevance = Math.round((source.relevance_score || 0.88) * 100)
                  const credibility = source.credibility_score || 'High'
                  const type = source.source_type || 'Academic'

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Source Title & Excerpt action */}
                      <td className="py-3.5 px-4 sm:px-5 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-snug line-clamp-2">
                            {source.title}
                          </span>
                          {source.snippet && (
                            <button
                              type="button"
                              onClick={() => setSelectedSource(source)}
                              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#2563EB] hover:underline cursor-pointer text-left w-fit"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View extracted quote</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          <span>{domain}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                        {source.published_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{formatDate(source.published_date)}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Classification */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isSupporting ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Supports
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200/60">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            Conflicting
                          </span>
                        )}
                      </td>

                      {/* Relevance */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2563EB] rounded-full"
                              style={{ width: `${relevance}%` }}
                            />
                          </div>
                          <span className="text-xs">{relevance}%</span>
                        </div>
                      </td>

                      {/* Credibility */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <Award className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>{credibility}</span>
                        </span>
                      </td>

                      {/* Open Source Button */}
                      <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-[#2563EB] hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for viewing excerpt */}
      {selectedSource && (
        <Modal
          isOpen={Boolean(selectedSource)}
          onClose={() => setSelectedSource(null)}
          title={selectedSource.title}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Globe className="h-3.5 w-3.5" />
              <span>{selectedSource.source_name || extractDomain(selectedSource.url)}</span>
              {selectedSource.published_date && (
                <>
                  <span>•</span>
                  <span>{formatDate(selectedSource.published_date)}</span>
                </>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 text-slate-700 leading-relaxed">
              <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
                Extracted Excerpt:
              </p>
              <p className="italic text-slate-800 text-sm">"{selectedSource.snippet}"</p>
            </div>

            {selectedSource.conflict_explanation && (
              <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Identified Nuance / Conflict:</span>
                {selectedSource.conflict_explanation}
              </div>
            )}

            {selectedSource.url && (
              <div className="pt-2 flex justify-end">
                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Visit Source Link
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SourcesList
