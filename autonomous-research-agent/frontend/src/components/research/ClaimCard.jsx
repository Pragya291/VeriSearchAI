import { ExternalLink } from 'lucide-react'
import VerdictBadge from './VerdictBadge'

export default function ClaimCard({ claim, theme = 'light', onViewEvidence }) {
  const isDark = theme === 'dark'
  const confidence = claim.confidence <= 1 ? Math.round(claim.confidence * 100) : claim.confidence
  const supportingSources = claim.supporting_sources || claim.sources || []

  return (
    <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm' : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className={isDark ? 'text-sm font-medium uppercase tracking-wide text-slate-400' : 'text-sm font-medium uppercase tracking-wide text-slate-400'}>Claim</p>
          <h4 className={isDark ? 'mt-2 text-lg font-semibold text-slate-100' : 'mt-2 text-lg font-semibold text-slate-900'}>{claim.claim}</h4>
        </div>
        <VerdictBadge verdict={claim.verdict} theme={theme} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Confidence</span>
            <span className={isDark ? 'font-medium text-slate-200' : 'font-medium text-slate-700'}>{confidence}%</span>
          </div>
          <div className={isDark ? 'h-2.5 overflow-hidden rounded-full bg-slate-700' : 'h-2.5 overflow-hidden rounded-full bg-slate-200'}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
          <p className={isDark ? 'text-sm font-medium text-slate-400' : 'text-sm font-medium text-slate-500'}>Explanation</p>
        <p className={isDark ? 'mt-2 text-sm leading-6 text-slate-300' : 'mt-2 text-sm leading-6 text-slate-700'}>{claim.explanation}</p>
      </div>

      <div className="mt-5">
        <p className={isDark ? 'text-sm font-medium text-slate-400' : 'text-sm font-medium text-slate-500'}>Supporting Sources</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {supportingSources.map((source, index) => (
            /^https?:\/\//i.test(source) ? (
              <a key={source} href={source} target="_blank" rel="noreferrer" className={isDark ? 'inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-400 hover:text-indigo-300' : 'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}>
                {new URL(source).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span key={`${source}-${index}`} className={isDark ? 'inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300' : 'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600'}>
                {source}
              </span>
            )
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (onViewEvidence) onViewEvidence(claim)
            else {
              const el = document.getElementById('evidence-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className={isDark ? 'mt-3 inline-flex text-xs font-medium text-indigo-300 hover:text-indigo-200 cursor-pointer' : 'mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer'}
        >
          View Evidence
        </button>
      </div>
    </div>
  )
}
