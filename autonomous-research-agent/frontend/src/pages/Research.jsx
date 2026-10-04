import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResearchLoader } from '../components/research/ResearchLoader'
import { ResearchInput } from '../components/research/ResearchInput'
import { createResearch } from '../services/api'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function Research() {
  const location = useLocation()
  const navigate = useNavigate()

  const questionParam = location.state?.question || ''
  const depthParam = location.state?.depth || 'Standard'
  const sourceTypeParam = location.state?.sourceType || 'All Sources'

  const [activeQuestion, setActiveQuestion] = useState(questionParam)
  const [stageIndex, setStageIndex] = useState(0)
  const [isResearching, setIsResearching] = useState(Boolean(questionParam))
  const [error, setError] = useState('')

  const hasInitiated = useRef(false)

  const runVerificationWorkflow = async (question, depth, sourceType) => {
    setIsResearching(true)
    setError('')
    setStageIndex(0)

    // Stage simulation timer for realistic UX feedback
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < 4 ? prev + 1 : prev))
    }, 1100)

    try {
      const report = await createResearch({ question, depth, sourceType })
      clearInterval(stageTimer)
      setStageIndex(4) // Generating verdict complete

      // Smooth transition to results page
      setTimeout(() => {
        navigate(`/app/results/${report.research_id}`, {
          replace: true,
          state: { report },
        })
      }, 700)
    } catch (err) {
      clearInterval(stageTimer)
      setError(err.response?.data?.detail || err.message || 'Verification workflow could not be completed.')
      setIsResearching(false)
    }
  }

  useEffect(() => {
    if (questionParam && !hasInitiated.current) {
      hasInitiated.current = true
      runVerificationWorkflow(questionParam, depthParam, sourceTypeParam)
    }
  }, [questionParam, depthParam, sourceTypeParam])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {isResearching ? 'Verification in Progress' : 'New Research Investigation'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isResearching
              ? 'Autonomous agent is executing multi-source verification.'
              : 'Submit a statement or inquiry to trigger fact verification.'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/app/dashboard')}
        >
          Dashboard
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Something went wrong while verifying this claim.</p>
            <p className="mt-0.5 text-xs text-rose-600">{error}</p>
            <div className="mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => runVerificationWorkflow(activeQuestion, depthParam, sourceTypeParam)}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {isResearching ? (
        <div className="py-8">
          <ResearchLoader
            currentStageIndex={stageIndex}
            claim={activeQuestion}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ResearchInput
            value={activeQuestion}
            onChange={setActiveQuestion}
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
