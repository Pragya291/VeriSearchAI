import { Search, Compass, Shield, Link2, Sparkles, TrendingUp } from 'lucide-react'

export function StatCard({ label, value, icon, change, className = '' }) {
  const ICON_MAP = {
    search: Search,
    compass: Compass,
    shield: Shield,
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
          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#22C55E] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            <TrendingUp className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
