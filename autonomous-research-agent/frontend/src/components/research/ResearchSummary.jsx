import { Sparkles } from 'lucide-react'

export function ResearchSummary({ summary, className = '' }) {
  if (!summary) return null

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5 text-[#2563EB] shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Executive Summary
        </h3>
      </div>

      <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700 font-normal">
        {summary}
      </p>
    </div>
  )
}

export default ResearchSummary
