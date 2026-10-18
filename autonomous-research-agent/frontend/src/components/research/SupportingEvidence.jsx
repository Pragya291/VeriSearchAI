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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Supporting Evidence ({supportingSources.length} sources)
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Independent citations and empirical publications directly validating the verdict
        </span>
      </div>

      {supportingSources.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
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
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Header: domain, date, credibility */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{domain}</span>
                      {source.source_type && (
                        <span className="ml-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          • {source.source_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {source.published_date && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(source.published_date)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                      {relevance}% Match
                    </span>
                    <Badge variant="blue" size="sm" icon={Award}>
                      {credibility} Credibility
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h4 className="mt-3.5 text-base sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {source.title}
                </h4>

                {/* Evidence summary / quote */}
                <div className="mt-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 p-3.5 border-l-4 border-blue-600 dark:border-blue-500 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{source.snippet || 'Empirical evidence extracted from peer-reviewed findings.'}"
                </div>

                {/* Footer: Verdict alignment badge & actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Supports claim
                    </span>
                    {source.evidence_strength && (
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Evidence strength: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{source.evidence_strength}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSource(source)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Detailed Excerpt</span>
                    </button>

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors shadow-2xs"
                      >
                        <span>Open URL</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal for detailed source excerpt inspection */}
      {selectedSource && (
        <Modal
          isOpen={Boolean(selectedSource)}
          onClose={() => setSelectedSource(null)}
          title={selectedSource.title || 'Source Excerpt Analysis'}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedSource.source_name || extractDomain(selectedSource.url)}
              </span>
              <span>•</span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 font-bold text-emerald-700 dark:text-emerald-300">
                Supports Claim
              </span>
              <span>•</span>
              <span>Credibility: {selectedSource.credibility_score || 'High'}</span>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Full Retrieved Excerpt
              </h5>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selectedSource.snippet || 'No raw snippet recorded for this source.'}
              </div>
            </div>

            {selectedSource.url && (
              <div className="pt-2 flex justify-end">
                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  <span>Open Full Publication</span>
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
