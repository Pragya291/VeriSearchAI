import { AlertTriangle, ExternalLink, Globe, Calendar, Award } from 'lucide-react'
import { extractDomain, formatDate } from '../../utils/formatters'
import { Badge } from '../ui/Badge'

export function ConflictingEvidence({
  sources = [],
  contradictions = [],
  className = '',
}) {
  const conflictingSources = sources.filter(
    (s) => s.supports_claim === false || s.conflict_explanation
  )

  const hasItems = conflictingSources.length > 0 || contradictions.length > 0

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Tab Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Conflicting Evidence ({conflictingSources.length || contradictions.length} sources)
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Nuances, counter-arguments, and outlier perspectives surfaced for objectivity
        </span>
      </div>

      {/* Subtle warning banner */}
      <div className="flex items-start gap-3 rounded-[18px] border border-amber-200/80 bg-amber-50/50 p-4 text-amber-950 shadow-2xs">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-amber-900">
            Some sources provide evidence that does not fully align with the overall conclusion.
          </p>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed text-xs">
            VeriSearchAI surfaces methodological caveats, contradictory clinical findings, and outlier perspectives to ensure complete empirical transparency.
          </p>
        </div>
      </div>

      {!hasItems ? (
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 text-center text-sm text-slate-500">
          No significant conflicting evidence or contradictory peer-reviewed sources were found for this inquiry.
        </div>
      ) : (
        <div className="space-y-4">
          {conflictingSources.length > 0
            ? conflictingSources.map((source, idx) => {
                const domain = source.source_name || (source.url ? extractDomain(source.url) : 'Peer-Reviewed Study')
                const whatContradicts = source.conflict_explanation || source.snippet
                const contradictionStrength = source.evidence_strength || 'Moderate'
                const credibility = source.credibility_score || 'High'

                return (
                  <div
                    key={idx}
                    className="rounded-[20px] border border-amber-200/70 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all hover:border-amber-300"
                  >
                    {/* Header: domain, date, credibility */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold text-xs">
                          <Globe className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{domain}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {source.published_date && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {formatDate(source.published_date)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200/70">
                          <AlertTriangle className="h-3 w-3" />
                          Contradiction
                        </span>
                        <Badge variant="amber" size="sm" icon={Award}>
                          {credibility} Credibility
                        </Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="mt-3.5 text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                      {source.title}
                    </h4>

                    {/* What contradicts the claim */}
                    <div className="mt-3 rounded-xl bg-amber-50/40 p-4 border-l-3 border-amber-500 text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <span className="font-bold text-amber-900 block mb-1">
                        What Contradicts the Claim:
                      </span>
                      {whatContradicts}
                    </div>

                    {/* Footer: Strength of contradiction & View Source */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-xs font-medium text-slate-600">
                        Strength of contradiction:{' '}
                        <strong className="text-amber-800 font-bold">{contradictionStrength}</strong>
                      </span>

                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 px-3.5 py-1.5 text-xs font-semibold text-amber-900 transition-colors"
                        >
                          <span>View Source</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })
            : contradictions.map((contra, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border border-amber-200/70 bg-white p-5 sm:p-6 shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Identified Contradiction #{idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{contra}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  )
}

export default ConflictingEvidence
