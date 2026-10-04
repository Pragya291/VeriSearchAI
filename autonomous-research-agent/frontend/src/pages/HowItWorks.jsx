import { useNavigate } from 'react-router-dom'
import {
  Search,
  Database,
  Scale,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Sparkles,
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'

export function HowItWorks() {
  const navigate = useNavigate()

  const detailedSteps = [
    {
      step: '01',
      title: 'Enter a Claim or Research Question',
      summary: 'Submit any claim, hypothesis, statement, or inquiry you want to investigate.',
      details: [
        'Natural language input accepts questions, affirmative assertions, or controversial claims.',
        'Choose investigation depth: Quick (rapid synthesis), Standard (comprehensive scan), or Deep (exhaustive academic meta-review).',
        'Filter source categories: Academic journals, Official government agencies (.gov, WHO, CDC), Verified news organizations, or broad web.',
      ],
      icon: Search,
    },
    {
      step: '02',
      title: 'Autonomous Multi-Source Retrieval',
      summary: 'Our intelligent agent orchestrates parallel search queries across authoritative indices.',
      details: [
        'Formulates targeted sub-queries to uncover both supporting and contrary evidence.',
        'Queries peer-reviewed portals (PubMed, Nature, PNAS, arXiv) alongside official public datasets.',
        'Evaluates publication dates, author affiliations, and domain reputations to assign credibility scores.',
      ],
      icon: Database,
    },
    {
      step: '03',
      title: 'Evidence Extraction & Conflict Detection',
      summary: 'VeriSearchAI maps out claims, extracts verbatim citations, and identifies contradictions.',
      details: [
        'Isolates concrete factual statements from raw web pages and academic snippets.',
        'Actively checks for conflicting conclusions, methodological limitations, or demographic caveats.',
        'Computes source agreement ratios and evidence alignment percentages without bias.',
      ],
      icon: Scale,
    },
    {
      step: '04',
      title: 'Synthesize Verdict & Transparent Confidence',
      summary: 'Generate an evidence-backed report with explicit verdicts and confidence metrics.',
      details: [
        'Assigns clear semantic verdict: SUPPORTED, TRUE, LIKELY TRUE, MIXED EVIDENCE, UNVERIFIED, LIKELY FALSE, or FALSE.',
        'Provides an objective confidence score derived from empirical evidence strength and source consensus.',
        'Presents fully cited sources, excerpts, and exportable PDF summaries.',
      ],
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
              <Sparkles className="h-3.5 w-3.5" />
              Methodology & Process
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How VeriSearchAI Works
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              From an unverified assertion to an objective, evidence-backed conclusion in seconds.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="space-y-8">
            {detailedSteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black text-xl">
                        {step.step}
                      </span>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                          {step.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">{step.summary}</p>
                      </div>
                    </div>

                    <span className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">
              Experience Evidence-Backed Verification Today
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Test claims with our pre-loaded research repository or run your own custom inquiry in real time.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/app/research')}
                iconRight={ArrowRight}
              >
                Launch Verification Agent
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HowItWorks
