import { Search } from 'lucide-react'
import Button from '../common/Button'

export default function ResearchInput({ value, onChange, onSubmit, examples, theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm md:p-7' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7'}>
      <div className="mb-4 flex items-center gap-3">
        <div className={isDark ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300' : 'flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'}>
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className={isDark ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-slate-900'}>Ask a Research Question</h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>The AI will search multiple sources, compare evidence, and generate a verified report.</p>
        </div>
      </div>

      <label className="sr-only" htmlFor="research-input">Ask a Research Question</label>
      <textarea
        id="research-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='What would you like me to research?'
        className={isDark ? 'min-h-28 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30' : 'min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100'}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>Example: “Is electric vehicle adoption increasing worldwide?”</div>
        <Button type="button" onClick={onSubmit} className="w-full sm:w-auto">
          Start Research
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
