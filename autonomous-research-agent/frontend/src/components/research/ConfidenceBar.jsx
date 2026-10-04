export default function ConfidenceBar({ value = 0, showLabel = true }) {
  const tone = value >= 80 ? 'High confidence' : value >= 60 ? 'Medium confidence' : 'Low confidence'
  const filled = Math.max(0, Math.min(100, value))

  return (
    <div>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Confidence</span>
          <span className="text-slate-500">{value}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${filled}%` }} />
      </div>
      {showLabel ? <p className="mt-2 text-xs text-slate-500">{tone}</p> : null}
    </div>
  )
}
