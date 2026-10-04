import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Search,
  ShieldCheck,
  Scale,
  Award,
  Gauge,
  CheckCircle2,
  History,
  FileDown,
  Layers,
  Globe,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'

export function Features() {
  const navigate = useNavigate()

  const allFeatures = [
    {
      title: 'Autonomous Multi-Query Retrieval',
      desc: 'Formulates multi-angle search queries across medical, scientific, and global news databases to capture the complete evidence landscape.',
      icon: Search,
      tag: 'Discovery',
    },
    {
      title: 'Deep Multi-Source Synthesis',
      desc: 'Retrieves, parses, and compares citations from distinct independent domains to prevent single-source bias.',
      icon: Globe,
      tag: 'Coverage',
    },
    {
      title: 'Domain Credibility Scoring',
      desc: 'Inspects academic affiliations, peer-review status, institutional registries, and publication recency to weigh source reliability.',
      icon: ShieldCheck,
      tag: 'Trust',
    },
    {
      title: 'Contradiction & Nuance Detection',
      desc: 'Identifies conflicting clinical trials, statistical caveats, and outlier conclusions, presenting disagreements clearly with warning badges.',
      icon: Scale,
      tag: 'Integrity',
    },
    {
      title: 'Objective Confidence Scoring',
      desc: 'Evidence-derived algorithmic score reflecting empirical strength, sample size, and inter-source alignment percentage.',
      icon: Gauge,
      tag: 'Analytics',
    },
    {
      title: 'Semantic Verdict Classification',
      desc: 'Standardized verdict taxonomy: SUPPORTED, TRUE, LIKELY TRUE, MIXED EVIDENCE, UNVERIFIED, LIKELY FALSE, or FALSE.',
      icon: CheckCircle2,
      tag: 'Clarity',
    },
    {
      title: 'Persistent Research Audit Trail',
      desc: 'Review past investigations, filter by verdict or confidence, and re-examine raw sources anytime.',
      icon: History,
      tag: 'Workflow',
    },
    {
      title: 'Exportable PDF & Shareable Reports',
      desc: 'Download publication-ready verification dossiers with executive summaries and full bibliographic citations.',
      icon: FileDown,
      tag: 'Export',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
              <Sparkles className="h-3.5 w-3.5" />
              Platform Capabilities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Features Built for Truth & Rigor
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Every feature in VeriSearchAI is engineered to maximize research transparency and minimize misinformation.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allFeatures.map((feat) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Banner */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-5 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready to verify claims with verifiable sources?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Join researchers, journalists, and knowledge workers who rely on VeriSearchAI for facts they can defend.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                iconRight={ArrowRight}
              >
                Create Free Account
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/app/dashboard')}
              >
                Open Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Features
