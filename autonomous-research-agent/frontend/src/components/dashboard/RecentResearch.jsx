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
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item) => {
        const id = item.research_id || item.id
        const sourcesCount =
          item.source_count || (item.sources ? item.sources.length : 0) || 10
        const dateStr = item.completed_at || item.created_at || item.date

        return (
          <div
            key={id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all"
          >
            {/* Left: Meta & Question */}
            <div className="space-y-2.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />
                <span className="text-xs font-bold text-[#0F172A]">
                  {item.confidence || 87}% Confidence
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Database className="h-3.5 w-3.5 text-slate-400" />
                  <span>{sourcesCount} sources</span>
                </span>
                {dateStr && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(dateStr)}</span>
                    </span>
                  </>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug tracking-tight">
                {item.question}
              </h4>
            </div>

            {/* Right: View Results Action Button */}
            <div className="shrink-0">
              <Link
                to={`/app/results/${id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 transition-all cursor-pointer shadow-2xs"
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
