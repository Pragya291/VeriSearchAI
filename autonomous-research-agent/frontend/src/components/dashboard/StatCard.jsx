import { CheckCheck, Gauge, Link2, Search } from 'lucide-react'

const iconMap = {
  search: Search,
  link: Link2,
  check: CheckCheck,
  gauge: Gauge,
}

export default function StatCard({ label, value, icon }) {
  const Icon = iconMap[icon] || Search

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  )
}
