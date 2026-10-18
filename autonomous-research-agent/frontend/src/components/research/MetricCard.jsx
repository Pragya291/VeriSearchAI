export function MetricCard({
  label,
  value,
  progress = 80,
  color = 'blue',
  subtitle,
  className = '',
}) {
  const colorMap = {
    blue: {
      bar: 'bg-blue-600 dark:bg-blue-500',
      value: 'text-slate-900 dark:text-slate-100',
    },
    teal: {
      bar: 'bg-teal-600 dark:bg-teal-400',
      value: 'text-teal-700 dark:text-teal-300',
    },
    green: {
      bar: 'bg-emerald-600 dark:bg-emerald-400',
      value: 'text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      bar: 'bg-amber-500 dark:bg-amber-400',
      value: 'text-amber-700 dark:text-amber-300',
    },
    rose: {
      bar: 'bg-rose-600 dark:bg-rose-400',
      value: 'text-rose-700 dark:text-rose-300',
    },
  }

  const selectedColor = colorMap[color] || colorMap.blue
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900 p-4 sm:p-5 border border-slate-100/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-colors ${className}`}
    >
      {/* Top row: Label and Value */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
          {label}
        </span>
        <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${selectedColor.value}`}>
          {value}
        </span>
      </div>

      {/* Middle row: Progress bar */}
      <div className="my-3 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${selectedColor.bar}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Bottom row: Subtitle descriptor */}
      {subtitle && (
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default MetricCard
