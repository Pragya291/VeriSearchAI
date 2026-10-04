import { Link } from 'react-router-dom'
import { ArrowRight, Database, Calendar } from 'lucide-react'
import { VerdictBadge } from '../research/VerdictBadge'
import { formatDate } from '../../utils/formatters'

export function RecentResearch({ items = [], className = '' }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
        No research sessions yet. Enter a question above to start your first verification.
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const id = item.research_id || item.id
        const sourcesCount =
          item.source_count || (item.sources ? item.sources.length : 0) || 8
        const dateStr = item.completed_at || item.created_at || item.date

        return (
          <div
            key={id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
          >
            {/* Left: Claim & meta */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />
                <span className="text-xs font-semibold text-slate-700">
                  {item.confidence || 85}% Confidence
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Database className="h-3 w-3" />
                  {sourcesCount} sources
                </span>
                {dateStr && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(dateStr)}
                    </span>
                  </>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug truncate">
                {item.question}
              </h4>
            </div>

            {/* Right: CTA */}
            <div className="shrink-0 flex items-center gap-2">
              <Link
                to={`/app/results/${id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-2xs"
              >
                <span>View Results</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RecentResearch
