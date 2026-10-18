import { MetricCard } from './MetricCard'

export function EvidenceAlignmentMatrix({
  evidenceStrength = 85,
  sourceAgreement = 80,
  researchCoverage = 88,
  conflictLevel = 'Low',
  className = '',
}) {
  const evidenceSubtitle =
    evidenceStrength >= 80
      ? 'Strong corroborating evidence'
      : evidenceStrength >= 65
      ? 'Moderate empirical support'
      : 'Preliminary or inconclusive data'

  const agreementSubtitle =
    sourceAgreement >= 80
      ? 'Consistent multi-source consensus'
      : sourceAgreement >= 60
      ? 'Contextual caveats noted'
      : 'Conflicting perspectives documented'

  const coverageSubtitle =
    researchCoverage >= 85
      ? 'Comprehensive source sample'
      : researchCoverage >= 70
      ? 'Standard representative sample'
      : 'Limited source availability'

  const normalizedConflict =
    typeof conflictLevel === 'string'
      ? conflictLevel.trim()
      : conflictLevel > 2
      ? 'High'
      : conflictLevel > 0
      ? 'Moderate'
      : 'Low'

  const conflictConfig = {
    Low: {
      color: 'green',
      progress: 20,
      subtitle: 'Minimal dissenting evidence',
    },
    Moderate: {
      color: 'amber',
      progress: 55,
      subtitle: 'Moderate methodological variance',
    },
    High: {
      color: 'rose',
      progress: 85,
      subtitle: 'Directly contradictory findings',
    },
  }[normalizedConflict] || {
    color: 'green',
    progress: 20,
    subtitle: 'Minimal dissenting evidence',
  }

  return (
    <section
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors ${className}`}
      aria-label="Evidence Alignment Matrix"
    >
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-5">
        Evidence Alignment Matrix
      </h2>

      {/* 2x2 Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <MetricCard
          label="Evidence Strength"
          value={`${evidenceStrength}%`}
          progress={evidenceStrength}
          color="blue"
          subtitle={evidenceSubtitle}
        />

        <MetricCard
          label="Source Agreement"
          value={`${sourceAgreement}%`}
          progress={sourceAgreement}
          color="teal"
          subtitle={agreementSubtitle}
        />

        <MetricCard
          label="Research Coverage"
          value={`${researchCoverage}%`}
          progress={researchCoverage}
          color="blue"
          subtitle={coverageSubtitle}
        />

        <MetricCard
          label="Conflict Level"
          value={normalizedConflict}
          progress={conflictConfig.progress}
          color={conflictConfig.color}
          subtitle={conflictConfig.subtitle}
        />
      </div>
    </section>
  )
}

export default EvidenceAlignmentMatrix
