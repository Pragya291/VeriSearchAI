import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResearchLoader } from '../components/research/ResearchLoader'
import { ResearchInput } from '../components/research/ResearchInput'
import { createResearchStream } from '../services/api'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function Research() {
  const location = useLocation()
  const navigate = useNavigate()

  const questionParam = location.state?.question || ''
  const depthParam = location.state?.depth || 'Standard'
  const sourceTypeParam = location.state?.sourceType || 'All Sources'

  const [activeQuestion, setActiveQuestion] = useState(questionParam)
  const [stageIndex, setStageIndex] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [sourceCount, setSourceCount] = useState(null)
  const [claimCount, setClaimCount] = useState(null)
  const [isResearching, setIsResearching] = useState(Boolean(questionParam))
  const [error, setError] = useState('')

  const abortControllerRef = useRef(null)
  const hasInitiatedRef = useRef(false)

  const stopActiveStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const runVerificationWorkflow = useCallback(
    async (question, depth = 'Standard', sourceType = 'All Sources') => {
      const cleanQuestion = question?.trim()
      if (!cleanQuestion || cleanQuestion.length < 5) {
        setError('Please enter a research inquiry of at least 5 characters.')
        setIsResearching(false)
        return
      }

      // Stop any existing stream
      stopActiveStream()

      setIsResearching(true)
      setError('')
      setStageIndex(0)
      setStatusMessage('Initializing autonomous investigation...')
      setSourceCount(null)
      setClaimCount(null)

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      await createResearchStream({
        question: cleanQuestion,
        signal: abortController.signal,
        onProgress: (payload) => {
          if (typeof payload.stage_index === 'number') {
            setStageIndex(payload.stage_index)
          }
          if (payload.message) {
            setStatusMessage(payload.message)
          }
          if (typeof payload.source_count === 'number') {
            setSourceCount(payload.source_count)
          }
          if (typeof payload.claim_count === 'number') {
            setClaimCount(payload.claim_count)
          }
        },
        onComplete: (report) => {
          setStageIndex(4)
          setStatusMessage('Research successfully verified and compiled.')
          // Seamless transition to report dossier
          setTimeout(() => {
            navigate(`/app/results/${report.research_id}`, {
              replace: true,
              state: { report },
            })
          }, 600)
        },
        onError: (err) => {
          if (abortController.signal.aborted) return
          setError(
            err.detail ||
              err.message ||
              'Unable to complete verification. Please verify the inquiry and try again.'
          )
          setIsResearching(false)
        },
      })
    },
    [navigate, stopActiveStream]
  )

  // Handle cancellation by user
  const handleCancel = () => {
    stopActiveStream()
    setIsResearching(false)
    setStatusMessage('')
  }

  // Auto-initiate if passed via navigation state
  useEffect(() => {
    if (questionParam && !hasInitiatedRef.current) {
      hasInitiatedRef.current = true
      runVerificationWorkflow(questionParam, depthParam, sourceTypeParam)
    }

    return () => {
      stopActiveStream()
    }
  }, [questionParam, depthParam, sourceTypeParam, runVerificationWorkflow, stopActiveStream])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {isResearching ? 'Verification in Progress' : 'New Research Investigation'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isResearching
              ? 'Autonomous agent pipeline is executing real-time multi-source verification.'
              : 'Submit a factual claim or complex question to trigger independent verification.'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => {
            stopActiveStream()
            navigate('/app/dashboard')
          }}
          className="dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Dashboard
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-rose-950 dark:text-rose-100">Verification Could Not Be Completed</p>
            <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">{error}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => runVerificationWorkflow(activeQuestion, depthParam, sourceTypeParam)}
                className="bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 hover:bg-rose-100/50"
              >
                Try Again
              </Button>
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setIsResearching(false)
                }}
                className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Research Progress OR Input View */}
      {isResearching ? (
        <div className="py-6">
          <ResearchLoader
            currentStageIndex={stageIndex}
            claim={activeQuestion}
            statusMessage={statusMessage}
            sourceCount={sourceCount}
            claimCount={claimCount}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ResearchInput
            value={activeQuestion}
            onChange={setActiveQuestion}
            loading={isResearching}
            onSubmit={({ question, depth, sourceType }) => {
              setActiveQuestion(question)
              runVerificationWorkflow(question, depth, sourceType)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Research
