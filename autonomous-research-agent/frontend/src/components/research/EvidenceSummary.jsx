import { CheckCircle2, AlertTriangle, Database } from 'lucide-react'

export function EvidenceSummary({
  supportingSources = 8,
  conflictingSources = 2,
  independentSources = 6,
  className = '',
}) {
  const cards = [
    {
      title: 'Supporting Evidence',
      count: supportingSources,
      suffix: 'sources',
      description: 'Independent sources with evidence directly validating the core claim.',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderClass: 'border-slate-200/80 hover:border-emerald-200',
      countColor: 'text-emerald-600',
    },
    {
      title: 'Conflicting Evidence',
      count: conflictingSources,
      suffix: 'sources',
      description: 'Sources pointing to counter-arguments, outliers, or opposing findings.',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      borderClass: 'border-slate-200/80 hover:border-amber-200',
      countColor: 'text-amber-600',
    },
    {
      title: 'Independent Sources',
      count: independentSources,
      suffix: 'domains',
      description: 'Distinct academic institutions, government registries, or publications analyzed.',
      icon: Database,
      iconBg: 'bg-blue-50 text-blue-600',
      borderClass: 'border-slate-200/80 hover:border-blue-200',
      countColor: 'text-blue-600',
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={`rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all ${card.borderClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight ${card.countColor}`}>
                {card.count}
              </span>
              <span className="text-sm font-medium text-slate-500">{card.suffix}</span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">{card.description}</p>
          </div>
        )
      })}
    </div>
  )
}

export default EvidenceSummary
