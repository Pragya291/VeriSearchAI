import { ArrowUpRight, ShieldCheck } from 'lucide-react'

const credibilityStyles = {
  High: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-red-100 text-red-700',
  Unknown: 'bg-slate-100 text-slate-600',
}

export default function SourceCard({ source }) {
  const domain = source.source_name || source.domain || 'Unknown source'
  const relevanceScore = source.relevance_score ?? (source.relevance || 0) / 100
  const relevance = Math.round(relevanceScore <= 1 ? relevanceScore * 100 : relevanceScore)
  const credibility = source.credibility_score || source.credibility || 'Unknown'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{source.title}</h4>
          <p className="mt-1 text-sm text-slate-500">{domain}</p>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          Open Source
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{source.snippet}</p>
      {source.published_date ? <p className="mt-2 text-xs text-slate-500">Published {source.published_date}</p> : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Relevance</span>
            <span className="font-medium text-slate-700">{relevance}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${relevance}%` }} />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Credibility</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${credibilityStyles[credibility] || credibilityStyles.Unknown}`}>
              {credibility}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{credibility} Credibility</span>
          </div>
        </div>
      </div>
    </div>
  )
}
