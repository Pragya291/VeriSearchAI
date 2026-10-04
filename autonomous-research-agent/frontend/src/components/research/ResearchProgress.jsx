const toneMap = {
  completed: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    border: 'border-emerald-200 bg-emerald-50',
  },
  'in-progress': {
    dot: 'bg-indigo-500',
    text: 'text-indigo-700',
    border: 'border-indigo-200 bg-indigo-50',
  },
  pending: {
    dot: 'bg-slate-300',
    text: 'text-slate-500',
    border: 'border-slate-200 bg-slate-50',
  },
}

export default function ResearchProgress({ steps = [], theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
      <h3 className={isDark ? 'mb-5 text-xl font-semibold text-slate-100' : 'mb-5 text-xl font-semibold text-slate-900'}>Research Pipeline</h3>
      <div className="space-y-3">
        {steps.map((step) => {
          const tone = toneMap[step.status]
          const bullet = step.status === 'completed' ? '✓' : step.status === 'in-progress' ? '●' : '○'
          const panelTone = isDark
            ? step.status === 'completed'
              ? 'border-emerald-500/25 bg-emerald-500/10'
              : step.status === 'in-progress'
                ? 'border-indigo-500/25 bg-indigo-500/10'
                : 'border-slate-700 bg-slate-800/70'
            : tone.border

          return (
            <div
              key={step.name}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${panelTone}`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${tone.dot}`}>
                {bullet}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : tone.text}`}>{step.name}</p>
              </div>
              <span className={isDark ? 'text-xs font-medium text-slate-400' : 'text-xs font-medium text-slate-500'}>
                {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
