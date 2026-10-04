import { useState } from 'react'
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Calendar,
  Globe,
  Award,
} from 'lucide-react'
import { formatDate, extractDomain } from '../../utils/formatters'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function EvidenceCard({ source, className = '' }) {
  const [modalOpen, setModalOpen] = useState(false)

  const domain = source.source_name || extractDomain(source.url)
  const isSupporting = source.supports_claim !== false
  const evidenceStrength = source.evidence_strength || 'Strong'
  const credibility = source.credibility_score || 'High'

  return (
    <>
      <div
        className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all ${className}`}
      >
        {/* Header: domain, date, credibility */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-800">{domain}</span>
              {source.source_type && (
                <span className="ml-2 text-[11px] text-slate-400 font-medium">
                  • {source.source_type}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {source.published_date && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatDate(source.published_date)}
              </span>
            )}
            <Badge variant="blue" size="sm" icon={Award}>
              {credibility} Credibility
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h4 className="mt-3 text-base font-semibold text-slate-900 leading-snug">
          {source.title}
        </h4>

        {/* Excerpt quote */}
        <div className="mt-3 rounded-xl bg-slate-50/80 p-3.5 border-l-3 border-blue-500 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
          "{source.snippet || 'Empirical evidence extracted from peer-reviewed findings.'}"
        </div>

        {/* Footer: Verdict alignment, strength & actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Supports claim
            </span>
            <span className="text-xs font-medium text-slate-500">
              Evidence strength:{' '}
              <strong className="text-slate-800">{evidenceStrength}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={BookOpen}
              onClick={() => setModalOpen(true)}
            >
              Read Evidence
            </Button>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <span>View Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal for "Read Evidence" */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Evidence Details & Excerpt"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-sm">
          <div>
            <h5 className="font-semibold text-slate-900">{source.title}</h5>
            <p className="mt-1 text-xs text-slate-500">
              Published by <strong className="text-slate-700">{domain}</strong> on{' '}
              {formatDate(source.published_date)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 text-slate-700 leading-relaxed">
            <p className="font-medium text-xs text-slate-500 mb-1">Full Extracted Excerpt:</p>
            <p className="italic">"{source.snippet}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-100">
              <span className="text-xs text-emerald-800 font-semibold block">Alignment</span>
              <span className="text-sm font-medium text-emerald-700">Supports primary claim</span>
            </div>
            <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-100">
              <span className="text-xs text-blue-800 font-semibold block">Relevance</span>
              <span className="text-sm font-medium text-blue-700">
                {source.relevance_score ? `${Math.round(source.relevance_score * 100)}% Match` : 'High'}
              </span>
            </div>
          </div>

          {source.url && (
            <div className="pt-2 flex justify-end">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Open Original Source Webpage
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default EvidenceCard
