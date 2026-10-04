const BADGE_VARIANTS = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
  orange: 'bg-orange-50 text-orange-800 border-orange-200/80',
  red: 'bg-rose-50 text-rose-700 border-rose-200/80',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  slate: 'bg-slate-100 text-slate-700 border-slate-200/80',
  purple: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
}

export function Badge({
  children,
  variant = 'blue',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.blue
  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : size === 'lg'
      ? 'px-3.5 py-1.2 text-sm gap-2'
      : 'px-2.5 py-1 text-xs gap-1.5'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />}
      <span>{children}</span>
    </span>
  )
}

export default Badge
