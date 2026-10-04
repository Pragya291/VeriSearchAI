export function ConfidenceScore({
  confidence = 87,
  evidenceStrength = 87,
  sourceAgreement = 82,
  size = 'md',
  className = '',
}) {
  const normalized = Math.min(100, Math.max(0, Math.round(confidence)))
  const radius = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  const strokeWidth = size === 'sm' ? 5 : size === 'lg' ? 7 : 6
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (normalized / 100) * circumference

  // Color selection based on confidence score
  const getStrokeColor = (score) => {
    if (score >= 80) return '#10B981' // Emerald
    if (score >= 60) return '#0D9488' // Teal
    if (score >= 40) return '#F59E0B' // Amber
    return '#E11D48' // Rose
  }

  const strokeColor = getStrokeColor(normalized)

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 ${className}`}>
      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="-rotate-90 transform transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            stroke="#E2E8F0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {normalized}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Confidence
          </span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="flex-1 w-full space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Evidence Strength</span>
            <span className="font-semibold text-slate-800">{evidenceStrength}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, evidenceStrength))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Source Agreement</span>
            <span className="font-semibold text-slate-800">{sourceAgreement}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, sourceAgreement))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfidenceScore
