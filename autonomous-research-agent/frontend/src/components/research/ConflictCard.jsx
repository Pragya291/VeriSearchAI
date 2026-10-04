export default function ConflictCard({ conflict }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="mb-3 text-sm font-medium uppercase tracking-wide text-amber-700">Conflicting Evidence</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-white/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Source A</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{conflict.sourceA}</p>
          <p className="mt-2 text-sm text-slate-700">{conflict.claimA}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Source B</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{conflict.sourceB}</p>
          <p className="mt-2 text-sm text-slate-700">{conflict.claimB}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-white/80 p-4">
        <p className="text-sm font-medium text-amber-800">Why the difference?</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{conflict.analysis}</p>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-white/80 p-4">
        <p className="text-sm font-medium text-amber-800">AI Analysis</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Both sources may be credible, but they measure different geographies or time windows. The rate of change appears to be context dependent rather than uniformly contradictory.
        </p>
      </div>
    </div>
  )
}
