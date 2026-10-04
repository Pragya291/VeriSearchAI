export function ProgressBar({
  value = 0,
  max = 100,
  label,
  sublabel,
  color = 'blue',
  showPercentage = true,
  height = 'h-2',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const COLOR_MAP = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    red: 'bg-rose-500',
  }

  const barColor = COLOR_MAP[color] || 'bg-blue-600'

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {label && <span className="font-medium text-slate-700">{label}</span>}
            {sublabel && <span className="text-slate-400">({sublabel})</span>}
          </div>
          {showPercentage && <span className="font-semibold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
