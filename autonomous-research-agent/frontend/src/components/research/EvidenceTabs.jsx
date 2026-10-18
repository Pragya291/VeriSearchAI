import { PieChart, FileText, AlertTriangle, Link2, CheckSquare } from 'lucide-react'

export function EvidenceTabs({
  activeTab = 'overview',
  onChange,
  claimsCount = 0,
  supportingCount = 0,
  conflictingCount = 0,
  sourcesCount = 0,
  className = '',
}) {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview & Matrix',
      icon: PieChart,
      badge: null,
      activeSuffix: null,
    },
    {
      id: 'claims',
      label: 'Atomic Claims',
      icon: CheckSquare,
      badge: claimsCount,
      activeSuffix: null,
    },
    {
      id: 'supporting',
      label: 'Supporting Evidence',
      icon: FileText,
      badge: supportingCount,
      activeSuffix: null,
    },
    {
      id: 'conflicting',
      label: 'Conflicting Evidence',
      icon: AlertTriangle,
      badge: conflictingCount,
      activeSuffix: null,
    },
    {
      id: 'sources',
      label: 'All Sources',
      icon: Link2,
      badge: sourcesCount,
      activeSuffix: null,
    },
  ]

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xs transition-colors ${className}`}
      role="tablist"
      aria-label="Research investigation sections"
    >
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar px-1 py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onChange?.(tab.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold transition-all duration-150 shrink-0 cursor-pointer rounded-xl ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 text-[10.5px] font-bold rounded-full transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EvidenceTabs
