import { Check, Loader2, Circle, Sparkles, ShieldCheck, XCircle, Search, Layers, AlertCircle } from 'lucide-react'

export const DEFAULT_PIPELINE_STAGES = [
  { id: 'init', name: 'Initializing investigation', desc: 'Registering inquiry & preparing agent' },
  { id: 'search', name: 'Searching web sources', desc: 'Indexing authoritative databases & journals' },
  { id: 'sources', name: 'Analyzing source credibility', desc: 'Scoring domain reliability & relevance' },
  { id: 'factcheck', name: 'Fact-checking & auditing conflicts', desc: 'Verifying claims against extracted evidence' },
  { id: 'report', name: 'Generating verified report', desc: 'Synthesizing verdict matrix & confidence' },
]

export function ResearchLoader({
  currentStageIndex = 0,
  claim = '',
  statusMessage = '',
  sourceCount = null,
  claimCount = null,
  onCancel,
  className = '',
}) {
  return (
    <div
      className={`mx-auto max-w-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] text-center transition-colors ${className}`}
    >
      {/* Animated icon */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900/50">
        <Loader2 className="h-8 w-8 animate-spin" strokeWidth={2.2} />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        Autonomous Research in Progress
      </h3>

      {claim && (
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium italic line-clamp-2 px-4">
          "{claim}"
        </p>
      )}

      {/* Live backend status message */}
      {statusMessage && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50/80 dark:bg-blue-950/50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 max-w-md truncate">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
          <span className="truncate">{statusMessage}</span>
        </div>
      )}

      {/* Real metadata indicators */}
      {(sourceCount !== null || claimCount !== null) && (
        <div className="mt-4 flex items-center justify-center gap-3 text-xs">
          {sourceCount !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700">
              <Search className="h-3 w-3 text-blue-500" />
              <span>{sourceCount} {sourceCount === 1 ? 'Source' : 'Sources'} Identified</span>
            </span>
          )}
          {claimCount !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700">
              <Layers className="h-3 w-3 text-indigo-500" />
              <span>{claimCount} {claimCount === 1 ? 'Claim' : 'Claims'} Formulated</span>
            </span>
          )}
        </div>
      )}

      {/* Progress Stages */}
      <div className="mt-6 space-y-2.5 text-left max-w-md mx-auto" role="status" aria-label="Research pipeline stages">
        {DEFAULT_PIPELINE_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex
          const isCurrent = idx === currentStageIndex

          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200 ${
                isCurrent
                  ? 'bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 text-blue-950 dark:text-blue-100 shadow-2xs'
                  : isDone
                  ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-600 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {isDone ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : isCurrent ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-300 dark:text-slate-700">
                    <Circle className="h-3.5 w-3.5" />
                  </span>
                )}

                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-semibold block leading-tight truncate">
                    {stage.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] text-blue-600/90 dark:text-blue-400 font-medium block truncate mt-0.5">
                      {stage.desc}
                    </span>
                  )}
                </div>
              </div>

              {isDone && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  Complete
                </span>
              )}
              {isCurrent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                  In progress...
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Strip with Cancel Option */}
      <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Cross-referencing verified scientific &amp; institutional records</span>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ResearchLoader
