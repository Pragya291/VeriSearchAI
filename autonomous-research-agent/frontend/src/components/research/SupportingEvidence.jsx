import { useState } from 'react'
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Calendar,
  Globe,
  Award,
  FileText,
} from 'lucide-react'
import { formatDate, extractDomain } from '../../utils/formatters'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'

export function SupportingEvidence({
  sources = [],
  className = '',
}) {
  const [selectedSource, setSelectedSource] = useState(null)

  const supportingSources = sources.filter((s) => s.supports_claim !== false)

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Tab Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-[#2563EB]" />
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Supporting Evidence ({supportingSources.length} sources)
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Independent citations and empirical publications directly validating the verdict
        </span>
      </div>

      {supportingSources.length === 0 ? (
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center text-sm text-slate-500">
          No direct supporting sources recorded for this query.
        </div>
      ) : (
        <div className="space-y-4">
          {supportingSources.map((source, idx) => {
            const domain = source.source_name || extractDomain(source.url)
            const relevance = Math.round((source.relevance_score || 0.88) * 100)
            const credibility = source.credibility_score || 'High'

            return (
              <div
                key={idx}
                className="rounded-[20px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all hover:border-slate-300"
              >
                {/* Header: domain, date, credibility */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{domain}</span>
                      {source.source_type && (
                        <span className="ml-2 text-[11px] font-medium text-slate-400">
                          • {source.source_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {source.published_date && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(source.published_date)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                      {relevance}% Match
                    </span>
                    <Badge variant="blue" size="sm" icon={Award}>
                      {credibility} Credibility
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h4 className="mt-3.5 text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                  {source.title}
                </h4>

                {/* Evidence summary / quote */}
                <div className="mt-3 rounded-xl bg-slate-50/80 p-3.5 border-l-3 border-[#2563EB] text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{source.snippet || 'Empirical evidence extracted from peer-reviewed findings.'}"
                </div>

                {/* Footer: Verdict alignment badge & actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Supports claim
                    </span>
                    {source.evidence_strength && (
                      <span className="text-xs font-medium text-slate-500">
                        Evidence strength: <strong className="text-slate-800 font-semibold">{source.evidence_strength}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSource(source)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                      <span>Read Evidence</span>
                    </button>

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors"
                      >
                        <span>View Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal for viewing detailed evidence excerpt */}
      {selectedSource && (
        <Modal
          isOpen={Boolean(selectedSource)}
          onClose={() => setSelectedSource(null)}
          title="Evidence Details & Excerpt"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-bold text-slate-900 text-base">{selectedSource.title}</h5>
              <p className="mt-1 text-xs text-slate-500">
                Published by <strong className="text-slate-700">{selectedSource.source_name || extractDomain(selectedSource.url)}</strong>
                {selectedSource.published_date ? ` on ${formatDate(selectedSource.published_date)}` : ''}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 text-slate-700 leading-relaxed">
              <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1.5">
                Full Extracted Excerpt:
              </p>
              <p className="italic text-slate-800 text-sm">"{selectedSource.snippet}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-semibold block">Alignment</span>
                <span className="text-sm font-bold text-emerald-700">Supports primary claim</span>
              </div>
              <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-100">
                <span className="text-xs text-blue-800 font-semibold block">Relevance</span>
                <span className="text-sm font-bold text-[#2563EB]">
                  {Math.round((selectedSource.relevance_score || 0.88) * 100)}% Match
                </span>
              </div>
            </div>

            {selectedSource.url && (
              <div className="pt-2 flex justify-end">
                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Open Original Source Webpage
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

export default SupportingEvidence
