import { ExternalLink } from 'lucide-react'
import VerdictBadge from './VerdictBadge'

export default function ClaimCard({ claim }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Claim</p>
          <h4 className="mt-2 text-lg font-semibold text-slate-900">{claim.claim}</h4>
        </div>
        <VerdictBadge verdict={claim.verdict} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Confidence</span>
            <span className="font-medium text-slate-700">{claim.confidence}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
              style={{ width: `${claim.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">Explanation</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{claim.explanation}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">Supporting Sources</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {claim.sources.map((source) => (
            <span key={source} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
              {source}
              <ExternalLink className="h-3 w-3" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
