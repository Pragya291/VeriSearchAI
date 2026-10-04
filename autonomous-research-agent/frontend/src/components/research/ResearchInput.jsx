import { ArrowRight, FileCheck2, Search, ShieldCheck, Scale } from 'lucide-react'
import Button from '../common/Button'

const researchModes = [
  { id: 'quick', label: 'Quick Verification', description: 'Fast answer with supporting evidence.', icon: ShieldCheck },
  { id: 'deep', label: 'Deep Research', description: 'Analyze multiple sources and compare evidence.', icon: Search },
  { id: 'claim', label: 'Claim Verification', description: 'Check whether a specific claim is true or misleading.', icon: FileCheck2 },
  { id: 'comparative', label: 'Comparative Research', description: 'Compare topics using evidence from multiple sources.', icon: Scale },
]

const sourceOptions = ['Web', 'Research Papers', 'News', 'Government / Official Sources']

export default function ResearchInput({
  value,
  onChange,
  onSubmit,
  examples,
  theme = 'light',
  advanced = false,
  mode = 'deep',
  onModeChange,
  sourceTypes = ['Web', 'Research Papers', 'News', 'Government / Official Sources'],
  onSourceTypesChange,
  depth = 'Standard',
  onDepthChange,
}) {
  const isDark = theme === 'dark'
  const fieldClass = isDark
    ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20'
    : 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'

  return (
    <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
      <div className="mb-4 flex items-center gap-3">
        <div className={isDark ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300' : 'flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'}>
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>
            {advanced ? 'What would you like to investigate?' : 'Ask a Research Question'}
          </h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>
            {advanced ? 'Start an AI-powered investigation and discover reliable evidence.' : 'The AI will search multiple sources, compare evidence, and generate a verified report.'}
          </p>
        </div>
      </div>

      <label className="sr-only" htmlFor="research-input">Ask a Research Question</label>
      <textarea
        id="research-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={advanced ? 'Ask a research question or enter a claim to verify…' : 'What would you like me to research?'}
        className={isDark ? 'min-h-28 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}
      />

      {advanced ? (
        <div className="mt-6 space-y-6">
          <fieldset>
            <legend className={isDark ? 'mb-3 text-sm font-semibold text-slate-200' : 'mb-3 text-sm font-semibold text-slate-800'}>Research Mode</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {researchModes.map(({ id, label, description, icon: Icon }) => {
                const selected = mode === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onModeChange(id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${selected
                      ? isDark ? 'border-indigo-400/60 bg-indigo-500/10 ring-1 ring-indigo-400/30' : 'border-indigo-300 bg-indigo-50/70 ring-1 ring-indigo-200'
                      : isDark ? 'border-slate-700 bg-slate-950 hover:border-slate-600' : 'border-slate-200 bg-white hover:border-indigo-200'}`}
                  >
                    <Icon className={selected ? 'mt-0.5 h-4 w-4 shrink-0 text-indigo-400' : 'mt-0.5 h-4 w-4 shrink-0 text-slate-400'} />
                    <span>
                      <span className={isDark ? 'block text-sm font-medium text-slate-100' : 'block text-sm font-medium text-slate-900'}>{label}</span>
                      <span className={isDark ? 'mt-1 block text-xs leading-5 text-slate-400' : 'mt-1 block text-xs leading-5 text-slate-500'}>{description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className={isDark ? 'mb-3 text-sm font-semibold text-slate-200' : 'mb-3 text-sm font-semibold text-slate-800'}>Sources</legend>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((source) => {
                const selected = sourceTypes.includes(source)
                return (
                  <button
                    key={source}
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    onClick={() => onSourceTypesChange(selected ? sourceTypes.filter((item) => item !== source) : [...sourceTypes, source])}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${selected
                      ? isDark ? 'border-indigo-400/50 bg-indigo-500/10 text-indigo-200' : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                      : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-600 hover:border-indigo-200'}`}
                  >
                    {source}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className={isDark ? 'block max-w-xs text-sm font-medium text-slate-300' : 'block max-w-xs text-sm font-medium text-slate-700'}>
            Research depth
            <select value={depth} onChange={(event) => onDepthChange(event.target.value)} className={`${fieldClass} mt-2`}>
              <option>Quick</option>
              <option>Standard</option>
              <option>Deep</option>
            </select>
          </label>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Example: “Is electric vehicle adoption increasing worldwide?”</div>
        <Button type="button" onClick={onSubmit} className="w-full sm:w-auto">
          {advanced ? 'Start Research' : 'Start Research'}
          {advanced ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
        </Button>
      </div>

      <div className="mt-6">
        <p className={isDark ? 'mb-3 text-xs font-medium uppercase tracking-wide text-slate-400' : 'mb-3 text-xs font-medium uppercase tracking-wide text-slate-400'}>Example Questions</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange(example)}
              className={isDark ? 'rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-300 transition hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300' : 'rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
