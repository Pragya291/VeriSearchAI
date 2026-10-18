import { ExternalLink, Eye, Award, Calendar, Globe } from 'lucide-react'
import { formatDate, extractDomain } from '../../utils/formatters'
import { Badge } from '../ui/Badge'

export function SourceCard({ source, onViewEvidence, className = '' }) {
  if (!source) return null

  const domain = source.source_name || extractDomain(source.url)
  const relevance = Math.round((source.relevance_score || 0.85) * 100)
  const credibility = source.credibility_score || 'High'
  const type = source.source_type || 'Academic'

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] hover:border-slate-300 dark:hover:border-slate-700 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Favicon & domain info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-sm border border-blue-100 dark:border-blue-900/40">
            <Globe className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug truncate">
              {source.title || domain}
            </h4>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{domain}</span>
              {source.published_date && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(source.published_date)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Relevance Score Pill */}
        <span className="shrink-0 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
          {relevance}% Relevance
        </span>
      </div>

      {/* Snippet / excerpt */}
      {source.snippet && (
        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
          "{source.snippet}"
        </p>
      )}

      {/* Badges: Source Type and Credibility */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3.5">
        <div className="flex items-center gap-2">
          <Badge variant="slate" size="sm" className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {type}
          </Badge>
          <Badge
            variant={credibility === 'High' ? 'green' : 'amber'}
            size="sm"
            icon={Award}
          >
            {credibility} Credibility
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onViewEvidence && (
            <button
              type="button"
              onClick={() => onViewEvidence(source)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>Examine Excerpt</span>
            </button>
          )}

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors"
            >
              <span>Visit Source</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default SourceCard
