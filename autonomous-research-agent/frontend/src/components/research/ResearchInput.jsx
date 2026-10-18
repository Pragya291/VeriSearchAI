import { useState } from 'react'
import { Sparkles, SlidersHorizontal, Check, CornerDownLeft } from 'lucide-react'

export const SAMPLE_QUESTIONS = [
  'Does regular exercise improve cognitive performance and memory?',
  'Does intermittent fasting extend human lifespan in clinical trials?',
  'Does remote work improve overall employee productivity and well-being?',
  'Is red light therapy clinically proven for collagen synthesis?',
]

export function ResearchInput({
  value = '',
  onChange,
  onSubmit,
  loading = false,
  className = '',
}) {
  const [depth, setDepth] = useState('Standard')
  const [selectedSourceType, setSelectedSourceType] = useState('All Sources')
  const [showOptions, setShowOptions] = useState(false)

  const depths = ['Quick', 'Standard', 'Deep']
  const sourceTypes = ['All Sources', 'News', 'Academic', 'Government', 'Web']

  const isValid = value.trim().length >= 5

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!isValid || loading) return
    onSubmit?.({
      question: value.trim(),
      depth,
      sourceType: selectedSourceType,
    })
  }

  const handleSelectSample = (sample) => {
    onChange?.(sample)
  }

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-colors ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              What claim or question would you like to verify?
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Search Options</span>
          </button>
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={2}
            placeholder="Example: Does regular aerobic exercise upregulate BDNF and improve memory?"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-y font-normal"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
          />
        </div>

        {/* Search Depth & Start Verification Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Depth selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Search depth:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/60 dark:border-slate-700/60">
              {depths.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepth(d)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    depth === d
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 sm:self-auto self-end">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <CornerDownLeft className="h-3 w-3" />
              Ctrl+Enter
            </span>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all cursor-pointer sm:w-auto w-full"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start Verification →</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source Preferences if expanded */}
        {showOptions && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Source preferences:</span>
            <div className="flex flex-wrap gap-1.5">
              {sourceTypes.map((source) => {
                const isSelected = selectedSourceType === source
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setSelectedSourceType(source)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                    <span>{source}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Example Suggestions */}
        <div className="pt-2">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">Try an example inquiry:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSelectSample(q)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700/80 transition-colors text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ResearchInput
