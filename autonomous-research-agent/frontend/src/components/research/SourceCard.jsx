import { ExternalLink, Eye, Award, Calendar, Globe } from 'lucide-react'
import { formatDate, extractDomain } from '../../utils/formatters'
import { Badge } from '../ui/Badge'

export function SourceCard({ source, onViewEvidence, className = '' }) {
  const domain = source.source_name || extractDomain(source.url)
  const relevance = Math.round((source.relevance_score || 0.85) * 100)
  const credibility = source.credibility_score || 'High'
  const type = source.source_type || 'Academic'

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Favicon & domain info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm border border-blue-100">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 leading-snug">
              {source.title || domain}
            </h4>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{domain}</span>
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
        <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
          {relevance}% Relevance
        </span>
      </div>

      {/* Snippet / preview */}
      {source.snippet && (
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {source.snippet}
        </p>
      )}

      {/* Badges: Source Type and Credibility */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <Badge variant="slate" size="sm">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Eye className="h-3 w-3 text-slate-500" />
              <span>View Evidence</span>
            </button>
          )}

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <span>Open Source</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default SourceCard
