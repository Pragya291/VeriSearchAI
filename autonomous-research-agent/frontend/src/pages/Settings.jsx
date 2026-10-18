import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  Bell,
  Sun,
  Moon,
  Laptop,
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
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { useTheme } from '../context/ThemeContext'
import { ThemeToggle } from '../components/ui/ThemeToggle'

function ToggleSwitch({ checked, onChange, id, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        checked ? 'bg-[#2563EB]' : 'bg-slate-200 dark:bg-slate-700'
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
  const { user, setUser } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()

  // Storage keys
  const emailKey = user?.email || 'guest'
  const prefsStorageKey = `verisearchai:user_prefs:${emailKey}`
  const profileStorageKey = `verisearchai:user_profile:${emailKey}`

  // Profile Form state
  const [fullName, setFullName] = useState(() => {
    try {
      const savedProfile = localStorage.getItem(profileStorageKey)
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        if (parsed.fullName) return parsed.fullName
      }
    } catch {
      // fallback
    }
    return user?.full_name || 'Alex Bennett'
  })
  const email = user?.email || 'alex.bennett@verisearch.ai'

  // Preferences state
  const [searchDepth, setSearchDepth] = useState('Quick (Rapid Synthesis)')
  const [citationFormat, setCitationFormat] = useState('APA 7th Edition')
  const [completionAlert, setCompletionAlert] = useState(true)
  const [contradictionWarning, setContradictionWarning] = useState(true)

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Verification Completed', text: 'Exercise & Cognitive Performance analysis finished with high confidence.', time: '10m ago', unread: true },
    { id: 2, title: 'Contradiction Alert', text: 'Methodological discrepancy detected in clinical trial cohort.', time: '2h ago', unread: true },
    { id: 3, title: 'Weekly Digest Ready', text: 'Systematic summary of newly evaluated academic sources added.', time: '1d ago', unread: false },
  ])

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(prefsStorageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.searchDepth) setSearchDepth(parsed.searchDepth)
        if (parsed.citationFormat) setCitationFormat(parsed.citationFormat)
        if (typeof parsed.completionAlert === 'boolean') setCompletionAlert(parsed.completionAlert)
        if (typeof parsed.contradictionWarning === 'boolean') setContradictionWarning(parsed.contradictionWarning)
      }
    } catch {
      // fallback
    }
  }, [prefsStorageKey])

  // Save feedback
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (e) => {
    e?.preventDefault()
    try {
      // 1. Update user profile
      const updatedUser = {
        ...user,
        full_name: fullName,
      }
      if (setUser) setUser(updatedUser)
      localStorage.setItem('verisearchai:current_user', JSON.stringify(updatedUser))

      // 2. Update user profile record
      const existingProfile = localStorage.getItem(profileStorageKey)
      const parsedProfile = existingProfile ? JSON.parse(existingProfile) : {}
      localStorage.setItem(
        profileStorageKey,
        JSON.stringify({ ...parsedProfile, fullName })
      )

      // 3. Update user preferences record
      localStorage.setItem(
        prefsStorageKey,
        JSON.stringify({
          searchDepth,
          citationFormat,
          completionAlert,
          contradictionWarning,
        })
      )

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save settings', err)
    }
  }

  const themeOptions = [
    {
      id: 'light',
      label: 'Light',
      description: 'Clean high-contrast theme optimized for bright environments.',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Deep slate theme engineered for reduced eye strain.',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System',
      description: 'Synchronizes automatically with your OS light/dark schedule.',
      icon: Laptop,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        {/* Left: Gear Icon + Title & Subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-[#2563EB] dark:text-blue-400 shadow-2xs">
            <SettingsIcon className="h-6 w-6 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Platform Settings
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Manage your researcher profile, interface appearance, and retrieval preferences.
            </p>
          </div>
        </div>

        {/* Right: Notification Bell & Quick Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0 relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {notificationsList.some((n) => n.unread) && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                <button
                  type="button"
                  onClick={() => setNotificationsList(notificationsList.map((n) => ({ ...n, unread: false })))}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                      item.unread
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50'
                        : 'bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* =================================================== */}
        {/* CARD 1: APPEARANCE & THEME (Light, Dark, System)   */}
        {/* =================================================== */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
                <Sparkles className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  Interface Appearance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Select your theme preference. Current display mode:{' '}
                  <strong className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{resolvedTheme}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = theme === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        <Check className="h-3.5 w-3.5" />
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{opt.label}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* =================================================== */}
        {/* CARD 2: RESEARCHER PROFILE                          */}
        {/* =================================================== */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.03)]">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
                <User className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  Researcher Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Update your identity details displayed on verification reports.
                </p>
              </div>
            </div>

            <Link
              to="/app/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-colors group cursor-pointer shrink-0"
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
                className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase mb-1.5 block"
              >
                FULL NAME
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F8FAFC]/40 dark:bg-slate-800/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label
                htmlFor="email"
                className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase mb-1.5 block"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/80 py-2.5 pl-10 pr-3 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-slate-500 stroke-[2]" />
                <span>Managed by authentication session</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================== */}
        {/* CARD 3: RESEARCH & OUTPUT PREFERENCES               */}
        {/* =================================================== */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.03)] space-y-6">
          {/* Card Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
              <Sliders className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                Research &amp; Output Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Customize search parameters and verification notification thresholds.
              </p>
            </div>
          </div>

          {/* Two-Column Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DEFAULT SEARCH DEPTH */}
            <div>
              <label
                htmlFor="searchDepth"
                className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase mb-1.5 block"
              >
                DEFAULT SEARCH DEPTH
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <select
                  id="searchDepth"
                  value={searchDepth}
                  onChange={(e) => setSearchDepth(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all cursor-pointer shadow-2xs"
                >
                  <option value="Quick (Rapid Synthesis)">Quick (Rapid Synthesis)</option>
                  <option value="Standard (Balanced Inquiry)">Standard (Balanced Inquiry)</option>
                  <option value="Deep (Exhaustive Academic)">Deep (Exhaustive Academic)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                Configures target citation volume and synthesis intensity.
              </p>
            </div>

            {/* CITATION & EXPORT FORMAT */}
            <div>
              <label
                htmlFor="citationFormat"
                className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase mb-1.5 block"
              >
                CITATION &amp; EXPORT FORMAT
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <select
                  id="citationFormat"
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all cursor-pointer shadow-2xs"
                >
                  <option value="APA 7th Edition">APA 7th Edition</option>
                  <option value="MLA 9th Edition">MLA 9th Edition</option>
                  <option value="Chicago Manual of Style">Chicago Manual of Style</option>
                  <option value="IEEE Format">IEEE Format</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                Standard format for reference export generation.
              </p>
            </div>
          </div>

          {/* Section Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
            {/* NOTIFICATIONS & ALERTS Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
                <Bell className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-wider uppercase">
                  NOTIFICATIONS &amp; ALERTS
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Real-time alerts for completed research runs and high-severity caveats.
                </p>
              </div>
            </div>

            {/* Row 1: Verification Completion Alert */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F8F0] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    Verification Completion Alert
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Trigger notification when autonomous research pipeline finishes.
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
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FEF7EC] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    High Contradiction Warnings
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Flag dissenting evidence and trial discrepancies prominently.
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
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800/60 px-3.5 py-2 text-xs font-bold text-[#059669] dark:text-emerald-300 animate-in fade-in">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Settings updated successfully</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
