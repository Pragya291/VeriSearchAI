import { Search, CheckCircle2, Gauge, Link2, Sparkles, TrendingUp } from 'lucide-react'

export function StatCard({ label, value, icon, change, className = '' }) {
  const ICON_MAP = {
    search: Search,
    check: CheckCircle2,
    gauge: Gauge,
    link: Link2,
    sparkles: Sparkles,
  }

  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] || Sparkles : icon || Sparkles

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <IconComponent className="h-4.5 w-4.5" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {change && (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
