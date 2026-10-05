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
      bar: 'bg-[#2563EB]',
      value: 'text-slate-900',
    },
    teal: {
      bar: 'bg-[#0D9488]',
      value: 'text-[#0D9488]',
    },
    green: {
      bar: 'bg-[#16A34A]',
      value: 'text-[#16A34A]',
    },
    amber: {
      bar: 'bg-[#F59E0B]',
      value: 'text-[#D97706]',
    },
    rose: {
      bar: 'bg-[#E11D48]',
      value: 'text-[#DC2626]',
    },
  }

  const selectedColor = colorMap[color] || colorMap.blue
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div
      className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-100/90 shadow-2xs hover:shadow-xs transition-shadow ${className}`}
    >
      {/* Top row: Label and Value */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800 tracking-tight">
          {label}
        </span>
        <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${selectedColor.value}`}>
          {value}
        </span>
      </div>

      {/* Middle row: Progress bar */}
      <div className="my-3 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${selectedColor.bar}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Bottom row: Subtitle descriptor */}
      {subtitle && (
        <p className="text-xs font-medium text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default MetricCard
