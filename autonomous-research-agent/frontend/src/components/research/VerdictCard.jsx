import { VerdictBadge } from './VerdictBadge'
import { ConfidenceScore } from './ConfidenceScore'
import { Card } from '../ui/Card'
import { Sparkles, ShieldCheck } from 'lucide-react'

export function VerdictCard({
  verdict = 'SUPPORTED',
  description = 'The available evidence generally supports this claim, although the strength of evidence varies across studies.',
  confidence = 87,
  evidenceStrength = 87,
  sourceAgreement = 82,
  className = '',
}) {
  return (
    <Card className={`overflow-hidden border-slate-200/90 ${className}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Verdict details */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AI Verdict
            </span>
            <VerdictBadge verdict={verdict} size="md" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {verdict === 'SUPPORTED'
              ? 'Claim Supported by Empirical Evidence'
              : verdict === 'TRUE'
              ? 'Claim Verified as True'
              : verdict === 'MIXED EVIDENCE'
              ? 'Mixed & Inconclusive Evidence'
              : verdict === 'FALSE'
              ? 'Claim Contradicted by Evidence'
              : `Verdict: ${verdict}`}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl">
            {description}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Multi-source verification confirmed across peer-reviewed and official datasets</span>
          </div>
        </div>

        {/* Right: Confidence visualization */}
        <div className="w-full lg:w-80 shrink-0 rounded-xl bg-slate-50/80 p-4 border border-slate-100">
          <ConfidenceScore
            confidence={confidence}
            evidenceStrength={evidenceStrength}
            sourceAgreement={sourceAgreement}
          />
        </div>
      </div>
    </Card>
  )
}

export default VerdictCard
