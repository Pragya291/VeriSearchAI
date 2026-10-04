import {
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertCircle,
  XCircle,
  Scale,
} from 'lucide-react'

/**
 * Standard verdict definitions as defined in the VeriSearchAI specification:
 * SUPPORTED, TRUE, LIKELY TRUE, MIXED EVIDENCE, UNVERIFIED, LIKELY FALSE, FALSE
 */
export const VERDICT_CONFIG = {
  SUPPORTED: {
    label: 'SUPPORTED',
    description: 'The available evidence generally supports this claim, with multiple independent sources confirming the findings.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    darkBadgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 ring-emerald-500/30',
    cardBorderClass: 'border-emerald-200',
    indicatorColor: '#10B981',
    accentBg: 'bg-emerald-50/70',
    icon: CheckCircle2,
    tone: 'positive',
  },
  TRUE: {
    label: 'TRUE',
    description: 'Established scientific consensus or definitive empirical facts confirm this statement without significant doubt.',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-600/20',
    darkBadgeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-700 ring-emerald-500/30',
    cardBorderClass: 'border-emerald-300',
    indicatorColor: '#059669',
    accentBg: 'bg-emerald-50',
    icon: CheckCircle,
    tone: 'positive',
  },
  'LIKELY TRUE': {
    label: 'LIKELY TRUE',
    description: 'High-quality independent evidence predominantly supports this claim, though minor caveats or edge cases exist.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-600/20',
    darkBadgeClass: 'bg-teal-950/60 text-teal-300 border-teal-800/80 ring-teal-500/30',
    cardBorderClass: 'border-teal-200',
    indicatorColor: '#0D9488',
    accentBg: 'bg-teal-50/70',
    icon: CheckCircle2,
    tone: 'positive',
  },
  'MIXED EVIDENCE': {
    label: 'MIXED EVIDENCE',
    description: 'Studies present competing outcomes or varying methodologies. Evidence neither conclusively proves nor disproves the claim.',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/20',
    darkBadgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80 ring-amber-500/30',
    cardBorderClass: 'border-amber-200',
    indicatorColor: '#F59E0B',
    accentBg: 'bg-amber-50/70',
    icon: AlertTriangle,
    tone: 'warning',
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    description: 'Insufficient high-credibility peer-reviewed or independent data exists to verify or dispute this claim.',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    darkBadgeClass: 'bg-slate-800 text-slate-300 border-slate-700 ring-slate-400/20',
    cardBorderClass: 'border-slate-200',
    indicatorColor: '#64748B',
    accentBg: 'bg-slate-100/70',
    icon: HelpCircle,
    tone: 'neutral',
  },
  'LIKELY FALSE': {
    label: 'LIKELY FALSE',
    description: 'The majority of credible independent research contradicts this claim, with little to no robust counter-evidence.',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200 ring-orange-600/20',
    darkBadgeClass: 'bg-orange-950/60 text-orange-300 border-orange-800/80 ring-orange-500/30',
    cardBorderClass: 'border-orange-200',
    indicatorColor: '#EA580C',
    accentBg: 'bg-orange-50/70',
    icon: AlertCircle,
    tone: 'warning',
  },
  FALSE: {
    label: 'FALSE',
    description: 'Directly contradicted by overwhelming empirical evidence, official records, or robust experimental data.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
    darkBadgeClass: 'bg-rose-950/60 text-rose-300 border-rose-800/80 ring-rose-500/30',
    cardBorderClass: 'border-rose-200',
    indicatorColor: '#E11D48',
    accentBg: 'bg-rose-50/70',
    icon: XCircle,
    tone: 'negative',
  },
}

/**
 * Normalizes input verdict string into standard config object
 */
export function getVerdictConfig(verdictStr) {
  if (!verdictStr) return VERDICT_CONFIG.UNVERIFIED

  const cleaned = String(verdictStr).trim().toUpperCase()

  if (VERDICT_CONFIG[cleaned]) {
    return VERDICT_CONFIG[cleaned]
  }

  // Fuzzy matches
  if (cleaned.includes('SUPPORT') || cleaned === 'TRUE' || cleaned.includes('VERIFIED')) {
    if (cleaned.includes('PARTIAL') || cleaned.includes('LIKELY')) return VERDICT_CONFIG['LIKELY TRUE']
    return VERDICT_CONFIG.SUPPORTED
  }
  if (cleaned.includes('MIX') || cleaned.includes('DISPUT')) {
    return VERDICT_CONFIG['MIXED EVIDENCE']
  }
  if (cleaned.includes('FALSE') || cleaned.includes('CONTRADICT')) {
    if (cleaned.includes('LIKELY')) return VERDICT_CONFIG['LIKELY FALSE']
    return VERDICT_CONFIG.FALSE
  }

  return VERDICT_CONFIG.UNVERIFIED
}
