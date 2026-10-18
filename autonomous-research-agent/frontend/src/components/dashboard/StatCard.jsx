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
      className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col justify-between transition-colors ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
          <IconComponent className="h-4.5 w-4.5 stroke-[2.2]" />
        </span>
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </div>

        {change ? (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <TrendingUp className="h-3 w-3 stroke-[2.5]" />
              <span>{change}</span>
            </span>
          </div>
        ) : (
          <div className="h-6 mt-2.5" />
        )}
      </div>
    </div>
  )
}

export default StatCard
