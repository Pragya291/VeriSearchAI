export function ActivityChart({ data = [], className = '' }) {
  // Fallback 7-day activity data matching Screenshot 2
  const chartData = data.length > 0 ? data : [
    { label: 'Mon', sources: 3 },
    { label: 'Tue', sources: 12 },
    { label: 'Wed', sources: 16 },
    { label: 'Thu', sources: 14 },
    { label: 'Fri', sources: 6 },
    { label: 'Sat', sources: 7 },
    { label: 'Sun', sources: 8 },
  ]

  const maxVal = 20

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-extrabold text-[#0F172A]">Research Activity</h3>
          <p className="text-xs font-medium text-slate-500">
            Independent sources reviewed and verified across recent sessions
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
          <span>Sources Analyzed</span>
        </div>
      </div>

      {/* Chart Canvas with Y-Axis Grid Lines */}
      <div className="relative pl-6 pt-2">
        {/* Y Axis Labels & Grid Lines */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-semibold text-slate-400">
          <span>15</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>

        {/* Bar Columns Container */}
        <div className="flex h-44 items-end gap-3 sm:gap-6 border-b border-slate-200 pb-1.5">
          {chartData.map((item, i) => {
            const val = item.sources || item.value || 0
            const pct = Math.max(6, Math.min(100, Math.round((val / maxVal) * 100)))

            return (
              <div
                key={item.label || i}
                className="flex-1 flex flex-col items-center justify-end h-full gap-2 group"
              >
                <div className="w-full flex justify-center h-full items-end">
                  <div
                    className="w-full max-w-10 rounded-t-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-300 relative cursor-pointer shadow-2xs"
                    style={{ height: `${pct}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-[#0F172A] px-2 py-1 text-[10px] font-bold text-white transition-opacity whitespace-nowrap z-20 shadow-md">
                      {val} sources
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#2563EB]">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityChart
