import { getVerdictConfig } from '../../utils/verdictUtils'

export function VerdictBadge({ verdict, size = 'md', className = '' }) {
  const config = getVerdictConfig(verdict)
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide rounded-full border ring-1 ${
        config.badgeClass
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={config.description}
    >
      <Icon className={`${iconSizes[size] || iconSizes.md} shrink-0`} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  )
}

export default VerdictBadge
