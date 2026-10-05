import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bookmark,
  ArrowRight,
  Database,
  Calendar,
  Sparkles,
  BookmarkCheck,
} from 'lucide-react'
import { VerdictBadge } from '../components/research/VerdictBadge'
import { getSavedResearch, deleteSavedResearch } from '../services/api'
import { formatDate } from '../utils/formatters'

export function SavedResearch() {
  const navigate = useNavigate()
  const [savedList, setSavedList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getSavedResearch()
      .then((items) => {
        if (isMounted) setSavedList(items || [])
      })
      .catch((err) => console.warn('Saved research fetch error', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async (researchId) => {
    const updated = await deleteSavedResearch(researchId)
    setSavedList(updated)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Page Header matching Reference Image */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
            Saved Research
          </h1>

          {/* Saved Reports Counter Pill */}
          <div className="rounded-xl border border-slate-200/90 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-2xs shrink-0 select-none">
            {savedList.length} saved {savedList.length === 1 ? 'report' : 'reports'}
          </div>
        </div>

        <p className="mt-1 text-sm text-slate-500 font-normal">
          Bookmarked verification dossiers and evidence reports for quick reference.
        </p>
      </div>

      {/* 2. Content Area: Saved Cards or Sophisticated Empty State */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="rounded-2xl lg:rounded-[22px] border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
                <div className="h-4 w-28 bg-slate-100 rounded-md" />
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
              </div>
              <div className="h-6 w-3/4 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      ) : savedList.length > 0 ? (
        <div className="space-y-3.5 sm:space-y-4">
          {savedList.map((item) => {
            const id = item.research_id || item.id
            const sourcesCount =
              item.source_count || (item.sources ? item.sources.length : 0) || 10
            const dateStr = item.saved_at || item.completed_at || item.created_at

            return (
              <div
                key={id}
                className="group relative rounded-2xl lg:rounded-[22px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-200"
              >
                {/* Top Metadata Row: Status + Confidence + Sources + Date + Unsave */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Badge */}
                    <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />

                    {/* Confidence */}
                    <div className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-bold text-slate-900">
                        {item.confidence || 85}% Confidence
                      </span>
                    </div>

                    {/* Separator dot */}
                    <span className="text-slate-300 select-none">•</span>

                    {/* Sources Count */}
                    <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                      <Database className="h-3.5 w-3.5 text-[#3B82F6]" />
                      <span>{sourcesCount} sources</span>
                    </div>

                    {/* Saved Date */}
                    {dateStr && (
                      <>
                        <span className="text-slate-300 select-none">•</span>
                        <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Saved {formatDate(dateStr)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bookmark Unsave Action Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="rounded-xl p-1.5 text-[#2563EB] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from saved"
                    aria-label="Remove from saved research"
                  >
                    <BookmarkCheck className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Main Row: Research Question & View Results Action */}
                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-base sm:text-[18px] lg:text-[19px] font-bold text-slate-900 leading-snug tracking-tight min-w-0 pr-2">
                    {item.question}
                  </h3>

                  <div className="shrink-0">
                    <Link
                      to={`/app/results/${id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-150 group/btn cursor-pointer"
                    >
                      <span>View Results</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* 3. Empty State matching Reference Image */
        <div className="rounded-3xl lg:rounded-[26px] border border-slate-200/80 bg-white bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:22px_22px] p-10 sm:p-14 lg:p-16 text-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {/* Centered Circular Icon Container */}
          <div className="mx-auto mb-6 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-[#EBF2FE] shadow-2xs">
            <Bookmark className="h-10 w-10 sm:h-12 sm:w-12 fill-[#2563EB] text-[#2563EB] stroke-[1.5]" />
          </div>

          {/* Heading */}
          <h2 className="mb-2 text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight">
            No saved research yet
          </h2>

          {/* Supporting Text */}
          <p className="mx-auto mb-7 max-w-md text-sm text-slate-500 leading-relaxed font-normal">
            Bookmark important claims and evidence cards during your investigations to access them here.
          </p>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => navigate('/app/research')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99]"
          >
            <span>Start New Research</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SavedResearch
