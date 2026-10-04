import { Check, CircleDashed, CircleSlash2, HelpCircle } from 'lucide-react'

const verdictMeta = {
  supported: {
    label: 'Supported',
    bg: 'bg-emerald-100 text-emerald-700',
    icon: Check,
  },
  'partially-supported': {
    label: 'Partially Supported',
    bg: 'bg-amber-100 text-amber-700',
    icon: CircleDashed,
  },
  contradicted: {
    label: 'Contradicted',
    bg: 'bg-red-100 text-red-700',
    icon: CircleSlash2,
  },
  unverified: {
    label: 'Unverified',
    bg: 'bg-slate-100 text-slate-600',
    icon: HelpCircle,
  },
}

export default function VerdictBadge({ verdict = 'supported', theme = 'light' }) {
  const isDark = theme === 'dark'
  const normalizedVerdict = verdict.toLowerCase().replaceAll(' ', '-')
  const verdictKey = normalizedVerdict === 'insufficient-evidence' ? 'unverified' : normalizedVerdict
  const meta = verdictMeta[verdictKey] || verdictMeta.unverified
  const Icon = meta.icon

  const darkTone = {
    supported: 'bg-emerald-400/10 text-emerald-300',
    'partially-supported': 'bg-amber-400/10 text-amber-300',
    contradicted: 'bg-rose-400/10 text-rose-300',
    unverified: 'bg-slate-700 text-slate-300',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${isDark ? darkTone[verdictKey] : meta.bg}`}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}
