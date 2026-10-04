import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Trash2, ArrowUpRight, Calendar, Sparkles } from 'lucide-react'
import { VerdictBadge } from '../components/research/VerdictBadge'
import { getSavedResearch, deleteSavedResearch } from '../services/api'
import { formatDate } from '../utils/formatters'
import { Button } from '../components/ui/Button'

export function SavedResearch() {
  const navigate = useNavigate()
  const [savedList, setSavedList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getSavedResearch()
      .then((items) => {
        if (isMounted) setSavedList(items)
      })
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-slate-200/70 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Saved Research
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bookmarked verification dossiers and evidence reports for quick reference.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {savedList.length} saved {savedList.length === 1 ? 'report' : 'reports'}
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading saved dossiers...</div>
      ) : savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedList.map((item) => {
            const id = item.research_id
            return (
              <div
                key={id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <VerdictBadge verdict={item.verdict || 'SUPPORTED'} size="sm" />
                    <span className="text-xs font-bold text-slate-800">
                      {item.confidence || 85}% Confidence
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.question}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.summary || item.verdict_description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Saved {formatDate(item.saved_at || item.created_at)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <Link
                      to={`/app/results/${id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty state matching Section 20 */
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No saved research yet.</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Bookmark important claims and evidence cards during your investigations to access them here.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/app/research')}
            >
              Start New Research
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedResearch
