import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Search,
  Scale,
  Sparkles,
  Database,
  History,
  Gauge,
  FileCheck2,
  Award,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { VerdictBadge } from '../components/research/VerdictBadge'
import { EvidenceSummary } from '../components/research/EvidenceSummary'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* =================================================== */}
        {/* 4. HERO SECTION                                     */}
        {/* =================================================== */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/70">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-100/60 to-indigo-100/40 blur-3xl -z-10" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* LEFT COLUMN: Text and CTA */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Small badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>AI research and source verification</span>
                </div>

                {/* Main label */}
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600">
                  VERISEARCHAI
                </p>

                {/* Large headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Research deeper,
                  <br />
                  <span className="text-blue-600">Verify smarter.</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  AI-powered research that searches multiple sources, verifies claims, compares
                  conflicting evidence, and generates evidence-backed conclusions.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    iconRight={ArrowRight}
                    onClick={() => navigate('/signup')}
                  >
                    Create Account →
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/features')}
                  >
                    Explore VeriSearchAI
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="pt-4 flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    Trust tied to evidence
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    Conflicts made visible
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    Multiple sources analyzed
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Polished "Evidence Review" product preview card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
                  {/* Preview Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                        <Sparkles className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Evidence review</p>
                        <p className="text-xs text-slate-400">Research synthesis</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      Verified
                    </span>
                  </div>

                  {/* Research Question */}
                  <div className="py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Research question
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-slate-900 leading-snug">
                      How strong is the evidence behind this claim?
                    </p>
                  </div>

                  {/* Rows matching specification */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.8">
                      <div className="flex items-center gap-2.5">
                        <Search className="h-4 w-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Independent sources
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Retrieved</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.8">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Evidence alignment
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Compared</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.8">
                      <div className="flex items-center gap-2.5">
                        <Scale className="h-4 w-4 text-amber-500" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Conflicts
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Checked</span>
                    </div>
                  </div>

                  {/* Evidence confidence row */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      Evidence confidence
                    </span>
                    <span className="text-xs font-bold text-blue-700">Evidence-based</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* 5A. TRUST / VALUE SECTION                            */}
        {/* =================================================== */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verification built around evidence.
            </h2>
            <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">
              VeriSearchAI eliminates hallucinated answers by binding every conclusion directly
              to peer-reviewed literature, official statistics, and primary sources.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 text-left shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                  <Database className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Multi-source Research</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Search and analyze information from multiple independent sources.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 text-left shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                  <Scale className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Evidence Comparison</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Compare supporting and contradicting evidence in one place.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 text-left shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                  <FileCheck2 className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Transparent Conclusions</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Understand why the AI reached its verdict.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* 5B. HOW IT WORKS                                    */}
        {/* =================================================== */}
        <section className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Simple, Robust Process
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                How VeriSearchAI works
              </h2>
              <p className="mt-3 text-base text-slate-500">
                From a claim to an evidence-backed conclusion.
              </p>
            </div>

            {/* 4 Steps: Horizontal on desktop, vertical timeline on mobile */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                {
                  number: '01',
                  title: 'Enter a Claim',
                  desc: 'Submit a claim, question, or statement you want to investigate.',
                  icon: Search,
                },
                {
                  number: '02',
                  title: 'Search Sources',
                  desc: 'AI searches for relevant and independent sources.',
                  icon: Database,
                },
                {
                  number: '03',
                  title: 'Compare Evidence',
                  desc: 'Evidence is analyzed for alignment, contradictions, and reliability.',
                  icon: Scale,
                },
                {
                  number: '04',
                  title: 'Generate Verdict',
                  desc: 'Receive a transparent verdict with supporting evidence and confidence.',
                  icon: CheckCircle2,
                },
              ].map((step, idx) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.number}
                    className="relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-blue-600 tracking-tight">
                        {step.number}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* 5C. FEATURES SECTION                                */}
        {/* =================================================== */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Capabilities
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything you need to verify information
              </h2>
              <p className="mt-3 text-base text-slate-500">
                A purpose-built suite of tools engineered for researchers, fact-checkers, and analysts.
              </p>
            </div>

            {/* 8 Feature cards */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'AI-powered research',
                  desc: 'Autonomous multi-query retrieval and context extraction across domains.',
                  icon: Sparkles,
                },
                {
                  title: 'Multi-source search',
                  desc: 'Simultaneous queries across academic journals, official databases, and news.',
                  icon: Search,
                },
                {
                  title: 'Source verification',
                  desc: 'Automated domain credibility scoring and institutional reputational checks.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Evidence comparison',
                  desc: 'Side-by-side claim extraction comparing methodology and statistical strength.',
                  icon: Scale,
                },
                {
                  title: 'Conflict detection',
                  desc: 'Surfaces contradictory findings and outliers rather than burying disagreements.',
                  icon: Award,
                },
                {
                  title: 'Confidence scoring',
                  desc: 'Objective, evidence-derived percentage reflecting source volume and consensus.',
                  icon: Gauge,
                },
                {
                  title: 'Evidence-backed verdicts',
                  desc: 'Transparent verdicts bound to cited passages and verified digital records.',
                  icon: CheckCircle2,
                },
                {
                  title: 'Research history',
                  desc: 'Searchable, filterable audit trail of all previous inquiries and saved reports.',
                  icon: History,
                },
              ].map((feat) => {
                const Icon = feat.icon
                return (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* 5D. PRODUCT PREVIEW SECTION                         */}
        {/* =================================================== */}
        <section className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Application Interface
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Live Verification Dashboard
              </h2>
              <p className="mt-3 text-base text-slate-500">
                See exactly how claims are presented with immediate verdicts, source citations, and conflict alerts.
              </p>
            </div>

            {/* Mock Application Dashboard Preview matching Section 5D */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] max-w-5xl mx-auto text-left space-y-6">
              {/* Claim Banner */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  INVESTIGATED CLAIM
                </span>
                <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                  "Does regular exercise improve cognitive performance?"
                </p>
              </div>

              {/* Verdict & Confidence Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/60 p-4">
                  <span className="text-xs text-emerald-800 font-semibold block">AI Verdict</span>
                  <div className="mt-2 flex items-center gap-2">
                    <VerdictBadge verdict="SUPPORTED" size="md" />
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    General empirical support across randomized trials with reproducible cognitive gains.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <span className="text-xs text-slate-500 font-semibold block">Overall Confidence</span>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">87%</p>
                  <p className="mt-1 text-xs text-slate-500">Evidence Strength: 87% • Agreement: 82%</p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <span className="text-xs text-slate-500 font-semibold block">Source Coverage</span>
                  <p className="mt-1 text-3xl font-extrabold text-blue-600">10 Sources</p>
                  <p className="mt-1 text-xs text-slate-500">8 Supporting • 2 Conflicting / Caveats</p>
                </div>
              </div>

              {/* Evidence Comparison Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                {/* Supporting Card Preview */}
                <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">harvard.edu • Academic</span>
                    <span className="font-semibold text-emerald-600">✓ Supports Claim</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "Regular physical activity has been associated with improvements in several measures of cognitive function, specifically executive task-switching..."
                  </p>
                </div>

                {/* Conflicting Card Preview */}
                <div className="rounded-xl border border-amber-200 p-4 bg-amber-50/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900">sciencedirect.com • Caveat</span>
                    <span className="font-semibold text-amber-700">⚠ Conflicting Observation</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "Immediate post-exhaustion testing revealed transient decrements in executive recall due to competing metabolic resources..."
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/app/results/res-exercise-cognition')}
                  iconRight={ArrowRight}
                >
                  View Full Verification Report →
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* 5E. CTA SECTION                                     */}
        {/* =================================================== */}
        <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to verify smarter?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Turn uncertain claims into evidence-backed conclusions.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/app/research')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Researching →</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
