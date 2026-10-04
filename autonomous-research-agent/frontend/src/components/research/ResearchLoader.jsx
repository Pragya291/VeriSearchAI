import { Check, Loader2, Circle, Sparkles, ShieldCheck } from 'lucide-react'

export const DEFAULT_PIPELINE_STAGES = [
  'Understanding claim',
  'Searching sources',
  'Analyzing evidence',
  'Checking conflicts',
  'Generating verdict',
]

export function ResearchLoader({
  currentStageIndex = 2,
  claim = '',
  sourcesFound = 8,
  className = '',
}) {
  return (
    <div
      className={`mx-auto max-w-xl rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center ${className}`}
    >
      {/* Animated icon */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
        <Loader2 className="h-8 w-8 animate-spin" strokeWidth={2.2} />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-900">
        Researching your claim...
      </h3>
      {claim && (
        <p className="mt-2 text-sm text-slate-600 font-medium italic line-clamp-2 px-4">
          "{claim}"
        </p>
      )}

      {/* Progress Stages */}
      <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
        {DEFAULT_PIPELINE_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex
          const isCurrent = idx === currentStageIndex
          const isUpcoming = idx > currentStageIndex

          return (
            <div
              key={stage}
              className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-50/80 border border-blue-200 text-blue-900 font-medium'
                  : isDone
                  ? 'bg-slate-50/70 border border-slate-100 text-slate-700'
                  : 'text-slate-400 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : isCurrent ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center text-slate-300">
                    <Circle className="h-4 w-4" />
                  </span>
                )}

                <span className="text-sm">{stage}</span>
              </div>

              {isDone && (
                <span className="text-xs font-semibold text-emerald-600">Complete</span>
              )}
              {isCurrent && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
                  In progress...
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Cross-referencing independent academic and government repositories</span>
      </div>
    </div>
  )
}

export default ResearchLoader
