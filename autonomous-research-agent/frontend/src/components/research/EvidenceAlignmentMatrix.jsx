import { MetricCard } from './MetricCard'

export function EvidenceAlignmentMatrix({
  evidenceStrength = 87,
  sourceAgreement = 82,
  researchCoverage = 89,
  conflictLevel = 'Low',
  className = '',
}) {
  // Determine dynamic subtitle descriptions based on values
  const evidenceSubtitle =
    evidenceStrength >= 80
      ? 'Strong consensus'
      : evidenceStrength >= 65
      ? 'Moderate consensus'
      : 'Emerging consensus'

  const agreementSubtitle =
    sourceAgreement >= 80
      ? 'Consistent data'
      : sourceAgreement >= 60
      ? 'Slight divergence'
      : 'Conflicting perspectives'

  const coverageSubtitle =
    researchCoverage >= 85
      ? 'Broad dataset'
      : researchCoverage >= 70
      ? 'Standard dataset'
      : 'Limited sampling'

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
      progress: 25,
      subtitle: 'Minimal conflicts',
    },
    Moderate: {
      color: 'amber',
      progress: 55,
      subtitle: 'Moderate divergence',
    },
    High: {
      color: 'rose',
      progress: 85,
      subtitle: 'Substantial conflicts',
    },
  }[normalizedConflict] || {
    color: 'green',
    progress: 25,
    subtitle: 'Minimal conflicts',
  }

  return (
    <section
      className={`rounded-[22px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${className}`}
      aria-label="Evidence Alignment Matrix"
    >
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-5">
        Evidence Alignment Matrix
      </h2>

      {/* 2x2 Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <MetricCard
          label="Evidence Alignment"
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
