import { PieChart, FileText, AlertTriangle, Link2 } from 'lucide-react'

export function EvidenceTabs({
  activeTab = 'overview',
  onChange,
  supportingCount = 6,
  conflictingCount = 2,
  sourcesCount = 6,
  className = '',
}) {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: PieChart,
      badge: null,
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
      label: 'Sources',
      icon: Link2,
      badge: sourcesCount,
      activeSuffix: 'active',
    },
  ]

  return (
    <div
      className={`rounded-[20px] border border-slate-200/80 bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${className}`}
      role="tablist"
      aria-label="Research sections"
    >
      <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto scrollbar-none px-2 py-1">
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
              className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 shrink-0 cursor-pointer rounded-xl ${
                isActive
                  ? 'text-[#2563EB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {tab.activeSuffix && (
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                >
                  {tab.activeSuffix}
                </span>
              )}

              {/* Blue indicator underline matching reference */}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-[#2563EB]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EvidenceTabs
