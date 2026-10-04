export default function ConflictCard({ conflict }) {
  const conflictText = typeof conflict === 'string'
    ? conflict
    : `${conflict.sourceA || 'Source A'}: ${conflict.claimA || ''} ${conflict.sourceB ? `| ${conflict.sourceB}: ${conflict.claimB || ''}` : ''}`
  const analysis = typeof conflict === 'string' ? '' : conflict.analysis || conflict.ai_analysis || ''

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="mb-3 text-sm font-medium uppercase tracking-wide text-amber-700">Conflicting Evidence</div>
      <p className="text-sm leading-6 text-slate-700">{conflictText}</p>
      {analysis && <p className="mt-3 border-t border-amber-200 pt-3 text-sm leading-6 text-slate-700">{analysis}</p>}
    </div>
  )
}
