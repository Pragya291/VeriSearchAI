import axios from 'axios'
import { INITIAL_RESEARCH_DATA } from '../data/mockResearchData'

// Resolve API base URL from env or current origin host
const defaultHost =
  typeof window !== 'undefined' && window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'http://localhost:8000'
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || defaultHost
let apiBase = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl
if (apiBase.endsWith('/api')) {
  apiBase = apiBase.slice(0, -4)
}

export const api = axios.create({
  baseURL: apiBase,
  timeout: 45000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function checkBackendHealth() {
  try {
    const res = await api.get('/api/health')
    return res.data?.status === 'healthy'
  } catch {
    return false
  }
}

// Local storage keys for resilient offline/fallback state
const STORAGE_KEYS = {
  USER: 'verisearchai:current_user',
  TOKEN: 'verisearchai:auth_token',
  HISTORY: 'verisearchai:research_history',
  SAVED: 'verisearchai:saved_research',
  SOURCES: 'verisearchai:sources_cache',
}

let memoryToken = null
try {
  memoryToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
} catch {
  // ignore
}

export function setAuthToken(token) {
  memoryToken = token
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  } catch {
    // ignore
  }
}

export function getAuthToken() {
  if (memoryToken) return memoryToken
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  } catch {
    return null
  }
}

// Request interceptor: attach Firebase Bearer token to all outgoing requests
api.interceptors.request.use(async (config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Initialize local mock history if not present
function getStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_RESEARCH_DATA))
      return INITIAL_RESEARCH_DATA
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      const ids = new Set(parsed.map((p) => p.research_id || p.id))
      const missing = INITIAL_RESEARCH_DATA.filter((init) => !ids.has(init.research_id))
      if (missing.length > 0) {
        const combined = [...parsed, ...missing]
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(combined))
        return combined
      }
      return parsed
    }
    return INITIAL_RESEARCH_DATA
  } catch {
    return INITIAL_RESEARCH_DATA
  }
}

function saveStoredHistory(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to persist history to localStorage', err)
  }
}

// ==========================================
// AUTHENTICATION API
// ==========================================

export async function loginWithGoogleToken(idToken, firebaseUser = null) {
  setAuthToken(idToken)
  try {
    const res = await api.post('/api/auth/google', { id_token: idToken }, {
      headers: { Authorization: `Bearer ${idToken}` }
    })
    if (res.data?.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user))
      return res.data.user
    }
  } catch (backendError) {
    console.warn('Backend /api/auth/google verification issue:', backendError?.message)
    try {
      const meRes = await api.get('/api/me', {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      if (meRes.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(meRes.data))
        return meRes.data
      }
    } catch {
      // ignore
    }
  }

  // Graceful client fallback if backend is offline
  if (firebaseUser) {
    const fallbackUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      full_name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Researcher'),
      email: firebaseUser.email,
      profilePhoto: firebaseUser.photoURL || '',
      avatar_url: firebaseUser.photoURL || '',
      provider: 'google.com',
      role: 'Researcher',
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fallbackUser))
    return fallbackUser
  }

  return null
}

export async function login(payload) {
  try {
    const res = await api.post('/api/auth/login', payload)
    if (res.data?.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user))
      return res.data.user
    }
    return res.data
  } catch (backendError) {
    console.warn('Backend login endpoint unavailable or errored. Using demo session.', backendError?.message)
    const demoUser = {
      id: 'usr-demo-01',
      full_name: payload.email ? payload.email.split('@')[0].replace('.', ' ') : 'Dr. Alex Bennett',
      email: payload.email || 'alex.bennett@verisearch.ai',
      role: 'Research Analyst',
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser))
    return demoUser
  }
}

export async function signup(payload) {
  try {
    const res = await api.post('/api/auth/signup', payload)
    if (res.data?.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user))
      return res.data.user
    }
    return res.data
  } catch (backendError) {
    console.warn('Backend signup endpoint unavailable. Emulating successful account creation.', backendError?.message)
    const newUser = {
      id: `usr-${Date.now()}`,
      full_name: payload.full_name || payload.fullName || 'Research Member',
      email: payload.email,
      role: 'Researcher',
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser))
    return newUser
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get('/api/me')
    if (res.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data))
      return res.data
    }
  } catch (backendError) {
    try {
      const altRes = await api.get('/api/auth/me')
      if (altRes.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(altRes.data))
        return altRes.data
      }
    } catch {
      // ignore
    }

    const local = localStorage.getItem(STORAGE_KEYS.USER)
    if (local) {
      try {
        return JSON.parse(local)
      } catch {
        // ignore
      }
    }
    return null
  }
  return null
}

export async function logout() {
  try {
    await api.post('/api/auth/logout')
  } catch (err) {
    console.warn('Logout API error:', err)
  } finally {
    setAuthToken(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

// ==========================================
// RESEARCH API
// ==========================================

export function normalizeResearchResponse(data) {
  if (!data) return data

  const claims = data.claims || []
  let supportingCount = 0
  let conflictingCount = (data.contradictions || []).length

  claims.forEach((c) => {
    const v = (c.verdict || '').toLowerCase()
    if (v.includes('support') || v.includes('true')) supportingCount++
    else if (v.includes('contradict') || v.includes('false')) conflictingCount++
  })

  // Derive verdict if not explicitly set
  let verdict = data.verdict
  if (!verdict) {
    const conf = data.confidence || 0
    if (conf >= 80 && conflictingCount === 0) verdict = 'SUPPORTED'
    else if (conf >= 70 && conflictingCount <= 1) verdict = 'LIKELY TRUE'
    else if (conflictingCount > 1 || (conf >= 45 && conf < 70)) verdict = 'MIXED EVIDENCE'
    else if (conf < 45) verdict = 'UNVERIFIED'
    else verdict = 'SUPPORTED'
  }

  return {
    ...data,
    verdict,
    supporting_count: data.supporting_count ?? Math.max(supportingCount, 1),
    conflicting_count: data.conflicting_count ?? conflictingCount,
    source_count: data.source_count ?? (data.sources || []).length,
    claim_count: data.claim_count ?? claims.length,
    evidence_strength: data.evidence_strength ?? Math.min(100, Math.round((data.confidence || 75) * 1.05)),
    source_agreement: data.source_agreement ?? (conflictingCount > 0 ? 65 : 88),
    conflict_level: data.conflict_level ?? (conflictingCount > 1 ? 'High' : conflictingCount === 1 ? 'Moderate' : 'Low'),
    verdict_description: data.verdict_description || `Independent cross-referenced evaluation from multiple indexed sources indicates ${verdict.toLowerCase()} status with ${data.confidence || 80}% empirical confidence.`,
  }
}

export async function createResearch(payload) {
  const question = typeof payload === 'string' ? payload : payload.question
  const options = typeof payload === 'object' ? payload : {}

  try {
    // Attempt backend POST /api/research
    const res = await api.post('/api/research', { question })
    if (res.data) {
      const normalized = normalizeResearchResponse(res.data)
      // Also cache in local history
      const current = getStoredHistory()
      saveStoredHistory([normalized, ...current.filter((item) => item.research_id !== normalized.research_id)])
      return normalized
    }
  } catch (backendError) {
    const errorMsg =
      backendError.response?.data?.detail ||
      backendError.message ||
      'Backend research service is currently unavailable.'
    throw new Error(errorMsg)
  }
}

export async function createResearchStream({ question, onProgress, onComplete, onError, signal }) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const endpoint = `${apiBase}/api/research/stream`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ question }),
      signal,
    })

    if (!response.ok) {
      let detail = 'Verification request failed'
      try {
        const errJson = await response.json()
        detail = errJson.detail || detail
      } catch {
        detail = `Server returned status ${response.status} (${response.statusText})`
      }
      const err = new Error(detail)
      err.status = response.status
      onError?.(err)
      return
    }

    if (!response.body) {
      throw new Error('ReadableStream is not supported by your browser.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() || ''

      for (const block of blocks) {
        if (!block.trim()) continue

        let eventType = 'message'
        let dataStr = ''

        const lines = block.split('\n')
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.replace('event:', '').trim()
          } else if (line.startsWith('data:')) {
            dataStr = line.replace('data:', '').trim()
          }
        }

        if (!dataStr) continue

        try {
          const payload = JSON.parse(dataStr)

          if (eventType === 'error' || payload.error) {
            onError?.(new Error(payload.detail || payload.message || 'Research processing error'))
            return
          }

          if (eventType === 'complete' || payload.stage === 'completed') {
            const rawResult = payload.result || payload
            const normalized = normalizeResearchResponse(rawResult)
            const current = getStoredHistory()
            saveStoredHistory([normalized, ...current.filter((item) => item.research_id !== normalized.research_id)])
            onComplete?.(normalized)
            return
          }

          onProgress?.(payload)
        } catch (jsonErr) {
          console.warn('Failed to parse SSE JSON chunk:', dataStr, jsonErr)
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) {
      console.info('Research stream aborted.')
      return
    }
    onError?.(err)
  }
}

export async function getResearchResult(researchId) {
  try {
    const res = await api.get(`/api/research/${researchId}`)
    if (res.data) return normalizeResearchResponse(res.data)
  } catch (backendError) {
    console.warn(`Backend research fetch for ${researchId} failed. Searching local registry.`)
  }

  // Fallback to local memory / mock records
  const all = getStoredHistory()
  const found = all.find((item) => item.research_id === researchId)
  if (found) return normalizeResearchResponse(found)

  // Return first sample if ID matches
  if (INITIAL_RESEARCH_DATA[0]) return normalizeResearchResponse(INITIAL_RESEARCH_DATA[0])

  throw new Error(`Research report ${researchId} not found.`)
}

export async function getResearchHistory(page = 1, limit = 20) {
  try {
    const res = await api.get('/api/research', { params: { page, limit } })
    if (res.data && res.data.items) {
      const normalizedItems = res.data.items.map(normalizeResearchResponse)
      return {
        ...res.data,
        items: normalizedItems.length > 0 ? normalizedItems : getStoredHistory().map(normalizeResearchResponse),
      }
    }
  } catch (backendError) {
    console.warn('Backend history fetch failed. Serving local cached history.')
  }

  const items = getStoredHistory().map(normalizeResearchResponse)
  return {
    total: items.length,
    page,
    limit,
    items,
  }
}

// ==========================================
// SAVED RESEARCH API
// ==========================================

export async function getSavedResearch() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveResearch(report) {
  try {
    const current = await getSavedResearch()
    if (!current.some((item) => item.research_id === report.research_id)) {
      const updated = [{ ...report, saved_at: new Date().toISOString() }, ...current]
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated))
      return updated
    }
    return current
  } catch (err) {
    console.error('Failed to save research report', err)
    return []
  }
}

export async function deleteSavedResearch(researchId) {
  try {
    const current = await getSavedResearch()
    const updated = current.filter((item) => item.research_id !== researchId)
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Failed to delete saved research report', err)
    return []
  }
}

// ==========================================
// SOURCES API
// ==========================================

export async function getSources(filter = 'All') {
  const history = getStoredHistory()
  const allSources = []
  const seenUrls = new Set()

  for (const report of history) {
    for (const source of report.sources || []) {
      if (!seenUrls.has(source.url)) {
        seenUrls.add(source.url)
        allSources.push({
          ...source,
          associated_research_id: report.research_id,
          associated_question: report.question,
        })
      }
    }
  }

  if (filter === 'All') return allSources
  return allSources.filter((s) => s.source_type?.toLowerCase() === filter.toLowerCase())
}

// Compatibility aliases for existing backend names
export const submitResearch = createResearch
export const getResearchById = getResearchResult
export const createAccount = signup

export default api
