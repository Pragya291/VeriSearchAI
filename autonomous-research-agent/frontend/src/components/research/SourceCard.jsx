import { useState } from 'react'
import { ArrowUpRight, ChevronDown, ShieldCheck } from 'lucide-react'

const credibilityStyles = {
  High: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-red-100 text-red-700',
  Unknown: 'bg-slate-100 text-slate-600',
}

export default function SourceCard({ source, theme = 'light' }) {
  const [showEvidence, setShowEvidence] = useState(false)
  const isDark = theme === 'dark'
  const domain = source.source_name || source.domain || 'Unknown source'
  const relevanceScore = source.relevance_score ?? (source.relevance || 0) / 100
  const relevance = Math.round(relevanceScore <= 1 ? relevanceScore * 100 : relevanceScore)
  const credibility = source.credibility_score || source.credibility || 'Unknown'
  const credibilityStyle = isDark
    ? { High: 'bg-emerald-400/10 text-emerald-300', Medium: 'bg-amber-400/10 text-amber-300', Low: 'bg-rose-400/10 text-rose-300', Unknown: 'bg-slate-700 text-slate-300' }
    : credibilityStyles

  return (
    <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm' : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className={isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'}>{source.title}</h4>
          <p className={isDark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-500'}>{domain}</p>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={isDark ? 'inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800' : 'inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100'}
        >
          Open Source
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className={isDark ? 'mt-4 text-sm leading-6 text-slate-300' : 'mt-4 text-sm leading-6 text-slate-600'}>{source.snippet?.slice(0, showEvidence ? undefined : 420)}</p>
      {source.published_date ? <p className={isDark ? 'mt-2 text-xs text-slate-500' : 'mt-2 text-xs text-slate-500'}>Published {source.published_date}</p> : null}
      {source.snippet?.length > 420 ? (
        <button type="button" onClick={() => setShowEvidence((visible) => !visible)} className={isDark ? 'mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200' : 'mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700'}>
          {showEvidence ? 'Hide Evidence' : 'View Evidence'}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showEvidence ? 'rotate-180' : ''}`} />
        </button>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className={isDark ? 'rounded-xl bg-slate-950 p-2.5' : 'rounded-xl bg-slate-50 p-2.5'}>
          <div className={isDark ? 'flex items-center justify-between text-xs text-slate-400' : 'flex items-center justify-between text-xs text-slate-500'}>
            <span>Relevance</span>
            <span className={isDark ? 'font-medium text-slate-200' : 'font-medium text-slate-700'}>{relevance}%</span>
          </div>
          <div className={isDark ? 'mt-2 h-2 overflow-hidden rounded-full bg-slate-700' : 'mt-2 h-2 overflow-hidden rounded-full bg-slate-200'}>
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${relevance}%` }} />
          </div>
        </div>

        <div className={isDark ? 'rounded-xl bg-slate-950 p-2.5' : 'rounded-xl bg-slate-50 p-2.5'}>
          <div className={isDark ? 'flex items-center justify-between text-xs text-slate-400' : 'flex items-center justify-between text-xs text-slate-500'}>
            <span>Credibility</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${credibilityStyle[credibility] || credibilityStyle.Unknown}`}>
              {credibility}
            </span>
          </div>
          <div className={isDark ? 'mt-2 flex items-center gap-2 text-xs text-slate-400' : 'mt-2 flex items-center gap-2 text-xs text-slate-500'}>
            <ShieldCheck className={isDark ? 'h-3.5 w-3.5 text-emerald-400' : 'h-3.5 w-3.5 text-emerald-600'} />
            <span>{credibility} Credibility</span>
          </div>
        </div>
      </div>
    </div>
  )
}
