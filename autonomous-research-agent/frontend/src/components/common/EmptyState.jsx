import { Search, Sparkles } from 'lucide-react'

export default function EmptyState({
  title = 'No Research Yet',
  description = 'Start your first research investigation and let the AI find and verify the evidence.',
  actionLabel = 'Start Research',
  onAction,
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Search className="h-8 w-8" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Sparkles className="h-4 w-4" />
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
