import { useState, useCallback } from 'react'
import {
  createResearch,
  getResearchResult,
  getResearchHistory,
  getSavedResearch,
  saveResearch as apiSaveResearch,
  deleteSavedResearch as apiDeleteSavedResearch,
} from '../services/api'

export function useResearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeResearch = useCallback(async (question, options) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createResearch({ question, ...options })
      return result
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Research execution failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchReport = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getResearchResult(id)
      return data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Unable to load report'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async (page, limit) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getResearchHistory(page, limit)
      return data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to load history'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSaved = useCallback(async () => {
    return await getSavedResearch()
  }, [])

  const toggleSave = useCallback(async (report) => {
    const current = await getSavedResearch()
    const isAlreadySaved = current.some((item) => item.research_id === report.research_id)
    if (isAlreadySaved) {
      return await apiDeleteSavedResearch(report.research_id)
    } else {
      return await apiSaveResearch(report)
    }
  }, [])

  return {
    loading,
    error,
    executeResearch,
    fetchReport,
    fetchHistory,
    fetchSaved,
    toggleSave,
  }
}
