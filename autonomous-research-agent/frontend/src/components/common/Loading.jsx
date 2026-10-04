export default function Loading({ theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm' : 'space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'}>
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-500" />
        <div className={isDark ? 'h-4 w-40 animate-pulse rounded-full bg-slate-700' : 'h-4 w-40 animate-pulse rounded-full bg-slate-200'} />
      </div>
      <div className="space-y-3">
        <div className={isDark ? 'h-3 w-full animate-pulse rounded-full bg-slate-700' : 'h-3 w-full animate-pulse rounded-full bg-slate-200'} />
        <div className={isDark ? 'h-3 w-5/6 animate-pulse rounded-full bg-slate-700' : 'h-3 w-5/6 animate-pulse rounded-full bg-slate-200'} />
        <div className={isDark ? 'h-3 w-4/6 animate-pulse rounded-full bg-slate-700' : 'h-3 w-4/6 animate-pulse rounded-full bg-slate-200'} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className={isDark ? 'h-20 animate-pulse rounded-xl bg-slate-800' : 'h-20 animate-pulse rounded-xl bg-slate-100'} />
        <div className={isDark ? 'h-20 animate-pulse rounded-xl bg-slate-800' : 'h-20 animate-pulse rounded-xl bg-slate-100'} />
        <div className={isDark ? 'h-20 animate-pulse rounded-xl bg-slate-800' : 'h-20 animate-pulse rounded-xl bg-slate-100'} />
      </div>
    </div>
  )
}
