import { ExternalLink, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react'
import { VerdictBadge } from './VerdictBadge'

export function ClaimCard({ claim, onViewEvidence, className = '' }) {
  if (!claim) return null

  const confidence =
    typeof claim.confidence === 'number'
      ? claim.confidence <= 1
        ? Math.round(claim.confidence * 100)
        : Math.round(claim.confidence)
      : 0

  const supportingSources = claim.supporting_sources || claim.sources || []
  const v = (claim.verdict || '').toLowerCase()
  const isContradicted = v.includes('contradict') || v.includes('false') || v.includes('unsupport')
  const isUnverified = v.includes('unverified') || v.includes('insufficient')

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors ${className}`}
    >
      {/* Header: Claim statement & Verdict Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Atomic Claim Statement
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            "{claim.claim}"
          </h4>
        </div>
        <div className="shrink-0 self-start">
          <VerdictBadge verdict={claim.verdict} size="md" />
        </div>
      </div>

      {/* Confidence Bar & Status Indicator */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Claim Confidence</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{confidence}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isContradicted
                  ? 'bg-rose-500'
                  : isUnverified
                  ? 'bg-slate-400'
                  : 'bg-gradient-to-r from-blue-600 to-emerald-500'
              }`}
              style={{ width: `${Math.max(confidence, 5)}%` }}
            />
          </div>
        </div>

        {/* Semantic Status Callout */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs flex items-center gap-2 border border-slate-100 dark:border-slate-800">
          {isContradicted ? (
            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : isUnverified ? (
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {isContradicted
              ? 'Empirical literature explicitly refutes this premise.'
              : isUnverified
              ? 'Insufficient data exists to corroborate this statement.'
              : 'Directly corroborated across independent repositories.'}
          </span>
        </div>
      </div>

      {/* Explanation */}
      {claim.explanation && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Verification Analysis
          </p>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {claim.explanation}
          </p>
        </div>
      )}

      {/* Supporting Sources */}
      {supportingSources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Referenced Source Links
          </p>
          <div className="flex flex-wrap gap-2">
            {supportingSources.map((source, index) => {
              const isUrl = /^https?:\/\//i.test(source)
              let hostname = source
              if (isUrl) {
                try {
                  hostname = new URL(source).hostname.replace('www.', '')
                } catch {
                  hostname = source
                }
              }

              return isUrl ? (
                <a
                  key={`${source}-${index}`}
                  href={source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs"
                >
                  <span>{hostname}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span
                  key={`${source}-${index}`}
                  className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  {source}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimCard
