import { Link } from 'react-router-dom'
import { BrandLogo } from './Navbar'
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo />
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              "Research deeper. Verify smarter." AI-powered research platform that searches multiple
              independent sources, verifies claims, compares conflicting evidence, and generates
              transparent, evidence-backed conclusions.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Trust tied to evidence
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Conflicts made visible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                Multi-source synthesis
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/app/research" className="hover:text-blue-600 transition-colors">
                  New Research
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/app/dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Trust Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Research & Trust
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/app/sources" className="hover:text-blue-600 transition-colors">
                  Source Registry
                </Link>
              </li>
              <li>
                <Link to="/app/history" className="hover:text-blue-600 transition-colors">
                  Verification History
                </Link>
              </li>
              <li>
                <Link to="/app/settings" className="hover:text-blue-600 transition-colors">
                  Preferences & API
                </Link>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy & Methodology
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-8 sm:flex-row gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} VeriSearchAI. All rights reserved. Built for evidence-backed research.
            </p>
            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1">
              <span>Developed by</span>
              <span className="font-semibold text-slate-900">Pragya Mishra</span>
              <span>&amp;</span>
              <span className="font-semibold text-slate-900">Janahvi Loke</span>
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200/80 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FastAPI Integration Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

