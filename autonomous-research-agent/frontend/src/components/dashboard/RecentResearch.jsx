import { Link } from 'react-router-dom'
import { ArrowRight, Database, Calendar, FileText } from 'lucide-react'
import { VerdictBadge } from '../research/VerdictBadge'
import { formatDate } from '../../utils/formatters'

export function RecentResearch({ items = [], className = '' }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <FileText className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">No research investigations yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Submit an inquiry above to generate your first verified findings.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item) => {
        const id = item.research_id || item.id
        const sourcesCount =
          item.source_count || (item.sources ? item.sources.length : 0) || 0
        const dateStr = item.completed_at || item.created_at || item.date

        return (
          <div
            key={id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            {/* Left: Meta & Question */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />
                {typeof item.confidence === 'number' && item.confidence > 0 && (
                  <>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.confidence}% Confidence
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                  </>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Database className="h-3.5 w-3.5 text-slate-400" />
                  <span>{sourcesCount} sources</span>
                </span>
                {dateStr && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(dateStr)}</span>
                    </span>
                  </>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
                {item.question}
              </h4>
            </div>

            {/* Right: View Results Action Button */}
            <div className="shrink-0">
              <Link
                to={`/app/results/${id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-blue-950/80 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer shadow-2xs"
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
