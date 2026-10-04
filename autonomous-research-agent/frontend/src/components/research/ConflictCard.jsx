import { AlertTriangle, ExternalLink, Globe } from 'lucide-react'
import { extractDomain } from '../../utils/formatters'

export function ConflictWarningBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-amber-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          Some sources provide evidence that does not fully align with the overall conclusion.
        </p>
        <p className="mt-1 text-xs text-amber-800 leading-relaxed">
          VeriSearchAI surfaces nuanced caveats, contradictory clinical findings, and outlier
          perspectives to ensure complete objectivity and scientific transparency.
        </p>
      </div>
    </div>
  )
}

export function ConflictCard({ conflict, source, className = '' }) {
  // Support both source objects with conflict details and raw string conflict explanations
  const title =
    typeof conflict === 'object'
      ? conflict.title || conflict.source_title
      : source?.title || 'Contradictory Observation'
  const explanation =
    typeof conflict === 'object'
      ? conflict.explanation || conflict.conflict_explanation || conflict.snippet
      : conflict
  const domain = source?.source_name || (source?.url ? extractDomain(source.url) : 'Independent Study')
  const strength = source?.evidence_strength || 'Moderate'

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-amber-300 transition-all ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700">
            <Globe className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-800">{domain}</span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200/60">
          <AlertTriangle className="h-3 w-3" />
          Conflicting Point
        </span>
      </div>

      <h4 className="mt-3 text-base font-semibold text-slate-900 leading-snug">{title}</h4>

      <div className="mt-3 rounded-xl bg-amber-50/50 p-3.5 border-l-3 border-amber-500 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <span className="font-semibold text-amber-900 block mb-1">Conflict analysis:</span>
        {explanation}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs font-medium text-slate-500">
          Evidence strength: <strong className="text-slate-800">{strength}</strong>
        </span>

        {source?.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 transition-colors"
          >
            <span>View Source</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  )
}

export default ConflictCard
