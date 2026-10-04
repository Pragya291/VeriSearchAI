export function ActivityChart({ data = [], className = '' }) {
  // Fallback 7-day activity data if none passed
  const chartData = data.length > 0 ? data : [
    { label: 'Mon', sources: 18, verified: 3 },
    { label: 'Tue', sources: 24, verified: 4 },
    { label: 'Wed', sources: 32, verified: 5 },
    { label: 'Thu', sources: 14, verified: 2 },
    { label: 'Fri', sources: 28, verified: 4 },
    { label: 'Sat', sources: 12, verified: 2 },
    { label: 'Sun', sources: 18, verified: 4 },
  ]

  const maxVal = Math.max(...chartData.map((d) => d.sources || d.value || 10), 10)

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Research Activity</h3>
          <p className="text-xs text-slate-500">
            Independent sources reviewed and verified across recent sessions
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Sources Analyzed
          </span>
        </div>
      </div>

      <div className="flex h-36 items-end gap-3 sm:gap-6 border-b border-slate-100 pb-2">
        {chartData.map((item, i) => {
          const val = item.sources || item.value || 0
          const pct = Math.max(8, Math.round((val / maxVal) * 100))

          return (
            <div
              key={item.label || i}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 group"
            >
              <div
                className="w-full max-w-8 rounded-t-lg bg-blue-500/85 transition-all duration-300 group-hover:bg-blue-600 relative cursor-pointer"
                style={{ height: `${pct}%` }}
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-white transition-opacity whitespace-nowrap z-10">
                  {val} sources
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-700">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityChart
