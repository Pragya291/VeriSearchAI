export default function ConfidenceBar({ value = 0, showLabel = true, theme = 'light' }) {
  const isDark = theme === 'dark'
  const tone = value >= 80 ? 'High confidence' : value >= 60 ? 'Medium confidence' : 'Low confidence'
  const filled = Math.max(0, Math.min(100, value))

  return (
    <div>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className={isDark ? 'font-medium text-slate-200' : 'font-medium text-slate-700'}>Confidence</span>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{value}%</span>
        </div>
      ) : null}
      <div className={isDark ? 'h-2.5 w-full overflow-hidden rounded-full bg-slate-700' : 'h-2.5 w-full overflow-hidden rounded-full bg-slate-200'}>
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${filled}%` }} />
      </div>
      {showLabel ? <p className={isDark ? 'mt-2 text-xs text-slate-400' : 'mt-2 text-xs text-slate-500'}>{tone}</p> : null}
    </div>
  )
}
