export default function ConflictCard({ conflict, theme = 'light' }) {
  const isDark = theme === 'dark'
  const conflictText = typeof conflict === 'string'
    ? conflict
    : `${conflict.sourceA || 'Source A'}: ${conflict.claimA || ''} ${conflict.sourceB ? `| ${conflict.sourceB}: ${conflict.claimB || ''}` : ''}`
  const analysis = typeof conflict === 'string' ? '' : conflict.analysis || conflict.ai_analysis || ''
  const hasSourcePair = typeof conflict !== 'string' && (conflict.sourceA || conflict.sourceB)

  return (
    <div className={isDark ? 'rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 shadow-sm' : 'rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm'}>
      <div className={isDark ? 'mb-3 text-sm font-medium uppercase tracking-wide text-amber-300' : 'mb-3 text-sm font-medium uppercase tracking-wide text-amber-700'}>Conflicting Evidence Detected</div>
      {hasSourcePair ? (
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <div className={isDark ? 'rounded-xl border border-slate-700 bg-slate-950/70 p-4' : 'rounded-xl border border-amber-200 bg-white/80 p-4'}>
            <p className={isDark ? 'text-xs font-medium uppercase text-slate-400' : 'text-xs font-medium uppercase text-slate-500'}>Source A</p>
            <p className={isDark ? 'mt-2 text-sm font-semibold text-slate-100' : 'mt-2 text-sm font-semibold text-slate-900'}>{conflict.sourceA}</p>
            <p className={isDark ? 'mt-2 text-sm leading-6 text-slate-300' : 'mt-2 text-sm leading-6 text-slate-700'}>{conflict.claimA}</p>
          </div>
          <span className={isDark ? 'self-center text-xs font-semibold text-slate-500' : 'self-center text-xs font-semibold text-slate-400'}>VS</span>
          <div className={isDark ? 'rounded-xl border border-slate-700 bg-slate-950/70 p-4' : 'rounded-xl border border-amber-200 bg-white/80 p-4'}>
            <p className={isDark ? 'text-xs font-medium uppercase text-slate-400' : 'text-xs font-medium uppercase text-slate-500'}>Source B</p>
            <p className={isDark ? 'mt-2 text-sm font-semibold text-slate-100' : 'mt-2 text-sm font-semibold text-slate-900'}>{conflict.sourceB}</p>
            <p className={isDark ? 'mt-2 text-sm leading-6 text-slate-300' : 'mt-2 text-sm leading-6 text-slate-700'}>{conflict.claimB}</p>
          </div>
        </div>
      ) : <p className={isDark ? 'text-sm leading-6 text-slate-300' : 'text-sm leading-6 text-slate-700'}>{conflictText}</p>}
      {analysis && <p className={isDark ? 'mt-3 border-t border-amber-400/20 pt-3 text-sm leading-6 text-slate-300' : 'mt-3 border-t border-amber-200 pt-3 text-sm leading-6 text-slate-700'}><span className="font-medium">AI Analysis: </span>{analysis}</p>}
      <a href="#sources-evidence" className={isDark ? 'mt-4 inline-flex text-sm font-medium text-indigo-300 hover:text-indigo-200' : 'mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700'}>Compare Sources</a>
    </div>
  )
}
