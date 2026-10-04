import { useState } from 'react'
import { ArrowRight, Sparkles, SlidersHorizontal, Check } from 'lucide-react'
import { Button } from '../ui/Button'

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
      className={`rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              What would you like to verify?
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{showOptions ? 'Hide Options' : 'Search Options'}</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={3}
            placeholder="Example: Does regular exercise improve cognitive performance?"
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
          />
        </div>

        {/* Depth & Source Type toggles */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 ${
            showOptions ? 'block' : 'flex'
          }`}
        >
          {/* Depth selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Search depth:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
              {depths.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepth(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    depth === d
                      ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!value.trim()}
            iconRight={ArrowRight}
            className="sm:w-auto w-full"
          >
            Start Verification →
          </Button>
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
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.8 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-blue-600" />}
                    <span>{source}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Example Suggestions */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-400 mb-2">Try an example inquiry:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSelectSample(q)}
                className="rounded-lg bg-slate-50 hover:bg-blue-50/70 hover:text-blue-700 hover:border-blue-200 px-2.5 py-1 text-xs text-slate-600 border border-slate-200/80 transition-colors text-left cursor-pointer"
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
