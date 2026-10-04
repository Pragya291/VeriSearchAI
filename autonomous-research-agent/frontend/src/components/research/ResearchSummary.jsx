import ConfidenceBar from './ConfidenceBar'

export default function ResearchSummary({ summary, confidence }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">Executive Summary</h3>
        <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
          {confidence}% Confidence
        </div>
      </div>

      <p className="text-base leading-7 text-slate-700">{summary}</p>

      <div className="mt-5">
        <ConfidenceBar value={confidence} />
      </div>
    </div>
  )
}
