import ConfidenceBar from './ConfidenceBar'

export default function ResearchSummary({ summary, confidence, theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-6' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6'}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Executive Summary</h3>
        <div className={isDark ? 'rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300' : 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700'}>
          {confidence}% Confidence
        </div>
      </div>

      <p className={isDark ? 'text-base leading-7 text-slate-300' : 'text-base leading-7 text-slate-700'}>{summary}</p>

      <div className="mt-5">
        <ConfidenceBar value={confidence} theme={theme} />
      </div>
    </div>
  )
}
