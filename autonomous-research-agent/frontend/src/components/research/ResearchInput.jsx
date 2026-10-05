import { useState } from 'react'
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react'

export const SAMPLE_QUESTIONS = [
  'Does regular exercise improve cognitive performance?',
  'Does intermittent fasting extend human lifespan?',
  'Does remote work improve overall employee productivity?',
  'Is red light therapy clinically proven for wrinkle reduction?',
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

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!value.trim() || loading) return
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
      className={`rounded-2xl border border-slate-200/90 bg-white p-6 md:p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              What would you like to verify?
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Search Options</span>
          </button>
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={2}
            placeholder="Example: Does regular exercise improve cognitive performance?"
            className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-sm leading-relaxed text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all resize-y"
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
            <span className="text-xs font-medium text-slate-500 mr-1">Search depth:</span>
            <div className="inline-flex rounded-xl bg-[#F1F5F9] p-0.5 border border-slate-200/60">
              {depths.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepth(d)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    depth === d
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Start Verification Button */}
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer sm:w-auto w-full"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Start Verification →</span>
              </>
            )}
          </button>
        </div>

        {/* Source Preferences if expanded */}
        {showOptions && (
          <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Source preferences:</span>
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
                        ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-[#2563EB]" />}
                    <span>{source}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Example Suggestions */}
        <div className="pt-2">
          <p className="text-xs font-medium text-slate-400 mb-2">Try an example inquiry:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSelectSample(q)}
                className="rounded-xl bg-[#F8FAFC] hover:bg-blue-50/80 hover:text-[#2563EB] hover:border-blue-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200/90 transition-colors text-left cursor-pointer"
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
