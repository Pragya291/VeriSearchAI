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
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] shrink-0">
          <IconComponent className="h-4.5 w-4.5 stroke-[2.2]" />
        </span>
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          {value}
        </div>

        {change ? (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E] px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-2xs">
              <TrendingUp className="h-3 w-3 stroke-[2.5]" />
              <span>{change}</span>
            </span>
          </div>
        ) : (
          <div className="h-6 mt-2.5" /> // whitespace placeholder to match height
        )}
      </div>
    </div>
  )
}

export default StatCard
