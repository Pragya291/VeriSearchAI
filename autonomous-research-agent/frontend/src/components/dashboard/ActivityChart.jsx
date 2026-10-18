export function ActivityChart({ data = [], className = '' }) {
  // If data provided has values, use max of values or at least 10 for clean scale
  const hasValues = data.some((d) => (d.sources || d.value || 0) > 0)
  const maxRecorded = Math.max(...data.map((d) => d.sources || d.value || 0), 0)
  const maxVal = Math.max(maxRecorded > 0 ? Math.ceil(maxRecorded * 1.25) : 10, 10)

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Research &amp; Evidence Activity
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Sources analyzed and corroborated across your recent investigations
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span>Verified Sources</span>
        </div>
      </div>

      {/* Chart Canvas with Y-Axis Grid Lines */}
      <div className="relative pl-7 pt-2">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 select-none">
          <span>{maxVal}</span>
          <span>{Math.round(maxVal * 0.75)}</span>
          <span>{Math.round(maxVal * 0.5)}</span>
          <span>{Math.round(maxVal * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Bar Columns Container */}
        <div className="flex h-44 items-end gap-3 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-1.5">
          {data.map((item, i) => {
            const val = item.sources || item.value || 0
            const pct = val > 0 ? Math.max(8, Math.min(100, Math.round((val / maxVal) * 100))) : 4

            return (
              <div
                key={item.label || i}
                className="flex-1 flex flex-col items-center justify-end h-full gap-2 group"
              >
                <div className="w-full flex justify-center h-full items-end">
                  <div
                    className={`w-full max-w-10 rounded-t-xl transition-all duration-300 relative cursor-pointer shadow-2xs ${
                      val > 0
                        ? 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                    style={{ height: `${pct}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-white transition-opacity whitespace-nowrap z-20 shadow-lg">
                      {val} {val === 1 ? 'source' : 'sources'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {!hasValues && (
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500 italic">
            Daily activity counts will populate as research investigations are completed.
          </p>
        )}
      </div>
    </div>
  )
}

export default ActivityChart
