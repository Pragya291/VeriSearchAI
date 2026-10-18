import { Search, Sparkles } from 'lucide-react'

export function EmptyState({
  title = 'No Research Yet',
  description = 'Start your first research investigation and let the AI find and verify the evidence.',
  actionLabel = 'Start Research',
  onAction,
}) {
  return (
    <div className="flex min-h-[380px] items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-8 transition-colors">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-2xs">
          <Search className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyState
