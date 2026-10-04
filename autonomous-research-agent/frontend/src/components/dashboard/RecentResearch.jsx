import { ArrowUpRight, CheckCircle2, Clock3, FileSearch, Sparkles } from 'lucide-react'

const statusStyles = {
  Completed: 'bg-emerald-100 text-emerald-700',
  'Partially Supported': 'bg-amber-100 text-amber-700',
  Researching: 'bg-indigo-100 text-indigo-700',
  'Insufficient Evidence': 'bg-amber-100 text-amber-700',
  Failed: 'bg-red-100 text-red-700',
}

const darkStatusStyles = {
  Completed: 'bg-emerald-400/10 text-emerald-300',
  'Partially Supported': 'bg-amber-400/10 text-amber-300',
  Researching: 'bg-indigo-400/10 text-indigo-300',
  'Insufficient Evidence': 'bg-amber-400/10 text-amber-300',
  Failed: 'bg-rose-400/10 text-rose-300',
}

export default function RecentResearch({ items, onSelect, theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Recent Research</h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Latest investigations and verified results</p>
        </div>
        <button type="button" className={isDark ? 'inline-flex items-center gap-2 text-sm font-medium text-indigo-300' : 'inline-flex items-center gap-2 text-sm font-medium text-indigo-600'}>
          <Sparkles className="h-4 w-4" />
          View all
        </button>
      </div>

      <div className="space-y-3">
        {items.length ? items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={isDark ? 'w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-left transition hover:border-indigo-400/50 hover:bg-slate-800' : 'w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60'}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className={isDark ? 'text-base font-semibold text-slate-100' : 'text-base font-semibold text-slate-900'}>{item.question}</p>
                <div className={isDark ? 'mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400' : 'mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500'}>
                  <span className="inline-flex items-center gap-1"><FileSearch className="h-3.5 w-3.5" /> {item.sources} Sources</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {(item.claimCount ?? item.claims?.length ?? 0)} Claims</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {item.date}</span>
                </div>
                <p className={isDark ? 'mt-3 text-sm text-slate-300' : 'mt-3 text-sm text-slate-600'}>Confidence: {item.confidence}%</p>
              </div>

              <div className="flex items-center gap-3 self-start md:items-center">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${(isDark ? darkStatusStyles : statusStyles)[item.status] || (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                  {item.status}
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
          )) : <p className={isDark ? 'rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400' : 'rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500'}>Your completed research reports will appear here.</p>}
      </div>
    </div>
  )
}
