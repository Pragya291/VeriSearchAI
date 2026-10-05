import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  Bell,
  Sun,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sliders,
  Search,
  FileText,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { useAuth } from '../auth/useAuth'

function ToggleSwitch({ checked, onChange, id, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-[#2563EB]' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function Settings() {
  const { user } = useAuth()

  // Profile Form state
  const [fullName, setFullName] = useState(user?.full_name || 'alex bennett')
  const email = user?.email || 'alex.bennett@verisearch.ai'

  // Preferences state
  const [searchDepth, setSearchDepth] = useState('Quick (Rapid Synthesis)')
  const [citationFormat, setCitationFormat] = useState('APA 7th Edition')

  // Notification toggles
  const [completionAlert, setCompletionAlert] = useState(true)
  const [contradictionWarning, setContradictionWarning] = useState(true)

  // Save feedback
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (e) => {
    e?.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Header matching Reference Image */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Gear Icon inside soft blue container + Title & Subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] shadow-2xs">
            <SettingsIcon className="h-6 w-6 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 leading-tight">
              Platform Settings
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-normal">
              Manage your researcher profile and retrieval preferences.
            </p>
          </div>
        </div>

        {/* Right: Notification Bell with Badge & Theme Light-Mode Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Switch theme"
            aria-label="Toggle light/dark mode"
          >
            <Sun className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================== */}
        {/* CARD 1: RESEARCHER PROFILE                          */}
        {/* =================================================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.03)]">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <User className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  Researcher Profile
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Update your personal information and account details.
                </p>
              </div>
            </div>

            <Link
              to="/app/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group cursor-pointer shrink-0"
            >
              <span>Full Profile Page</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Form Fields: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 block"
              >
                FULL NAME
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-200/90 bg-[#F8FAFC]/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label
                htmlFor="email"
                className="text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 block"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="w-full rounded-xl border border-slate-200/90 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm text-slate-700 font-medium cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-slate-400 stroke-[2]" />
                <span>Managed by account owner</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================== */}
        {/* CARD 2: RESEARCH & OUTPUT PREFERENCES               */}
        {/* =================================================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.03)] space-y-6">
          {/* Card Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <Sliders className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                Research &amp; Output Preferences
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Customize how your research is performed and results are delivered.
              </p>
            </div>
          </div>

          {/* Two-Column Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DEFAULT SEARCH DEPTH */}
            <div>
              <label
                htmlFor="searchDepth"
                className="text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 block"
              >
                DEFAULT SEARCH DEPTH
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="searchDepth"
                  value={searchDepth}
                  onChange={(e) => setSearchDepth(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-800 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-2xs"
                >
                  <option value="Quick (Rapid Synthesis)">Quick (Rapid Synthesis)</option>
                  <option value="Standard (Balanced Inquiry)">Standard (Balanced Inquiry)</option>
                  <option value="Deep (Exhaustive Academic)">Deep (Exhaustive Academic)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-normal">
                Choose how deep the AI should search for information.
              </p>
            </div>

            {/* CITATION & EXPORT FORMAT */}
            <div>
              <label
                htmlFor="citationFormat"
                className="text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 block"
              >
                CITATION &amp; EXPORT FORMAT
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="citationFormat"
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-800 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-2xs"
                >
                  <option value="APA 7th Edition">APA 7th Edition</option>
                  <option value="MLA 9th Edition">MLA 9th Edition</option>
                  <option value="Chicago Manual of Style">Chicago Manual of Style</option>
                  <option value="IEEE Format">IEEE Format</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-normal">
                Select your preferred citation style and export format.
              </p>
            </div>
          </div>

          {/* Section Divider */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            {/* NOTIFICATIONS & ALERTS Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <Bell className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  NOTIFICATIONS &amp; ALERTS
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Stay informed about your research activity and system updates.
                </p>
              </div>
            </div>

            {/* Row 1: Verification Completion Alert */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F8F0] text-[#059669]">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    Verification Completion Alert
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">
                    Notify when an autonomous search concludes.
                  </p>
                </div>
              </div>

              <ToggleSwitch
                id="completionAlert"
                label="Toggle Verification Completion Alert"
                checked={completionAlert}
                onChange={setCompletionAlert}
              />
            </div>

            {/* Row 2: High Contradiction Warnings */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FEF7EC] text-[#D97706]">
                  <AlertTriangle className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    High Contradiction Warnings
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">
                    Flag severe conflicting data from high-credibility sources.
                  </p>
                </div>
              </div>

              <ToggleSwitch
                id="contradictionWarning"
                label="Toggle High Contradiction Warnings"
                checked={contradictionWarning}
                onChange={setContradictionWarning}
              />
            </div>
          </div>
        </div>

        {/* Save Actions Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {saveSuccess ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8F8F0] border border-[#A7F3D0] px-3.5 py-2 text-xs font-bold text-[#059669] animate-in fade-in">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Settings updated successfully</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
