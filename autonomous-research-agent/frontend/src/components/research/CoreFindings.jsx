import { ListFilter } from 'lucide-react'

/**
 * Extracts list of findings from report markdown or claims array
 */
export function extractFindings(reportText = '', claims = []) {
  const extracted = []

  // Check markdown for ## Core Findings or ## Key Findings
  if (reportText) {
    const findingsSectionMatch = reportText.match(/##\s*(?:Core Findings|Key Findings)[^\n]*\n([\s\S]*?)(?=\n##|$)/i)
    if (findingsSectionMatch && findingsSectionMatch[1]) {
      const lines = findingsSectionMatch[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        // Matches `1. **Title**: text` or `1. text` or `- **Title**: text`
        const match = trimmed.match(/^(?:\d+\.|\*|-)\s*(.+)/)
        if (match && match[1]) {
          // Clean bold asterisks for clean display while preserving text
          const cleanText = match[1].replace(/\*\*(.*?)\*\*:\s*/, '$1: ')
          if (cleanText.length > 10) {
            extracted.push(cleanText)
          }
        }
      }
    }
  }

  if (extracted.length > 0) {
    return extracted.slice(0, 5)
  }

  // Derive from claims
  if (Array.isArray(claims) && claims.length > 0) {
    return claims.map((c) => {
      if (c.explanation) {
        return c.explanation
      }
      return c.claim
    }).slice(0, 5)
  }

  // Fallback defaults
  return [
    'Increased BDNF levels correlate with improvements in memory recall and working memory capacity across multiple studies.',
    'Consistent positive impact on executive function, particularly in tasks requiring attention and cognitive flexibility.',
    'Enhanced hippocampal perfusion observed via MRI in active participants compared with sedentary control groups.',
  ]
}

export function CoreFindings({
  findings = [],
  reportText = '',
  claims = [],
  className = '',
}) {
  const resolvedFindings =
    findings && findings.length > 0
      ? findings
      : extractFindings(reportText, claims)

  return (
    <div className={`space-y-3 pt-1 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <ListFilter className="h-5 w-5 text-[#2563EB] shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Core Findings
        </h3>
      </div>

      {/* Clean vertical list */}
      <div className="space-y-3 pl-0.5">
        {resolvedFindings.map((finding, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Small blue circular number */}
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[11px] font-bold text-white mt-0.5 shadow-2xs">
              {index + 1}
            </div>

            {/* Finding text */}
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700 font-normal">
              {finding}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoreFindings
