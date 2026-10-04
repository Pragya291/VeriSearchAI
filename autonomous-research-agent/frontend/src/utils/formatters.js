/**
 * Date formatter for user-friendly display
 */
export function formatDate(dateString) {
  if (!dateString) return 'Recent'
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Format relative time (e.g., '2 hours ago')
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Just now'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(dateString)
  } catch {
    return dateString
  }
}

/**
 * Extract clean domain name from URL
 */
export function extractDomain(url) {
  if (!url) return 'web'
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || 'source'
  }
}

/**
 * Format confidence percentage
 */
export function formatPercentage(num) {
  if (num === null || num === undefined) return '0%'
  const val = typeof num === 'number' && num <= 1 ? Math.round(num * 100) : Math.round(num)
  return `${Math.min(100, Math.max(0, val))}%`
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(text, length = 140) {
  if (!text || text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}
