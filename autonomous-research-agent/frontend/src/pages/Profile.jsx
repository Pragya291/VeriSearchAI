import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { Card } from '../components/ui/Card'
import {
  User,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Check,
  SlidersHorizontal,
  Search,
  Settings,
  Calendar,
  Plus,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react'

export function Profile() {
  const { user, setUser } = useAuth()

  // Storage key for user profile
  const storageKey = `verisearchai:user_profile:${user?.email || 'guest'}`

  const defaultProfile = {
    fullName: user?.full_name?.toLowerCase() || 'alex bennett',
    email: user?.email || 'alex.bennett@verisearch.ai',
    phone: '+1 (555) 234-5678',
    location: '100 Innovation Way',
    city: 'Cambridge',
    pincode: '02138',
    title: 'Senior Research Analyst',
    institution: 'Institute for Evidence & Fact Analysis',
    expertise: ['Cognitive Health', 'Neuroscience', 'Clinical Trials', 'Public Health', 'Meta-Analysis'],
  }

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) }
      }
    } catch {
      // fallback
    }
    return defaultProfile
  })

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: 'English (US)',
    notifications: 'Email Alerts & Synthesis Digest',
    researchUpdates: true,
    weeklyDigest: true,
    securityAlerts: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [prefSuccess, setPrefSuccess] = useState(false)

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed || profile.expertise.includes(trimmed)) return
    setProfile({
      ...profile,
      expertise: [...profile.expertise, trimmed],
    })
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove) => {
    setProfile({
      ...profile,
      expertise: profile.expertise.filter((t) => t !== tagToRemove),
    })
  }

  const handleSaveProfile = (e) => {
    e?.preventDefault()
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile))
      const updatedUser = {
        ...user,
        full_name: profile.fullName,
        role: profile.title,
      }
      setUser(updatedUser)
      localStorage.setItem('verisearchai:current_user', JSON.stringify(updatedUser))

      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save profile', err)
    }
  }

  const handleSavePreferences = (e) => {
    e?.preventDefault()
    try {
      localStorage.setItem(`verisearchai:user_prefs:${user?.email || 'guest'}`, JSON.stringify(preferences))
      setPrefSuccess(true)
      setTimeout(() => setPrefSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save preferences', err)
    }
  }

  // Generate Initials e.g. AB
  const getInitials = (name) => {
    if (!name) return 'AB'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-2.5rem)] flex flex-col justify-between space-y-2 bg-[#F8FAFC]">
      {/* Toast Notification */}
      {(saveSuccess || prefSuccess) && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#bbf7d0] bg-[#DCFCE7] px-4 py-2.5 text-xs font-semibold text-[#166534] shadow-lg animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          <span>{saveSuccess ? 'Profile saved successfully!' : 'Preferences updated successfully!'}</span>
        </div>
      )}

      {/* TOP BAR: Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 py-0.5">
        <div className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
          <span>Profile</span>
          <ChevronRight className="h-3 w-3 text-[#64748B]" />
          <span className="text-[#0F172A] font-bold">Researcher Profile</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-2xs hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Close Editing' : 'Edit Profile'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Search functionality coming soon.')}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => alert('You have 3 new notifications!')}
            className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2563EB] text-[9px] font-bold text-white">
              3
            </span>
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white font-bold text-xs shadow-2xs">
            {getInitials(profile.fullName)}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER BANNER CARD (Compact Desktop Height)                           */}
      {/* ========================================================================= */}
      <Card className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(15,23,42,0.06)] shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] via-[#1E40AF] to-[#1D4ED8] text-white font-extrabold text-lg shadow-md ring-4 ring-[#EFF6FF]">
              {getInitials(profile.fullName)}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
                  {profile.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#bbf7d0] bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                  <CheckCircle2 className="h-3 w-3 text-[#22C55E] fill-[#22C55E] text-white" />
                  Verified Researcher
                </span>
              </div>

              <p className="text-xs font-semibold text-[#334155]">
                {profile.title} at {profile.institution}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#64748B] pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3 text-[#64748B]" />
                  {profile.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#64748B]" />
                  {profile.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#64748B]" />
                  {profile.city} • {profile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3.5 py-1 text-xs font-semibold text-[#334155]">
              <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Active • Verified since Jan 2024</span>
            </span>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN GRID                                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start flex-1 min-h-0 overflow-y-auto pb-2">
        {/* LEFT STACK (Personal Info & Credentials) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Personal Information */}
          <Card className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(15,23,42,0.06)] space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <User className="h-4.5 w-4.5 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                Personal Information
              </h2>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#64748B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">Mobile</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">City</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#334155] block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={profile.pincode}
                      onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:bg-white outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-all cursor-pointer shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Personal Information</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Full Name</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                    {profile.fullName}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Email</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A] truncate">
                    {profile.email}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Mobile</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                    {profile.phone}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Location</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                    {profile.location}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">City</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                    {profile.city}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Pincode</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                    {profile.pincode}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Academic Credentials */}
          <Card className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(15,23,42,0.06)] space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                Academic &amp; Institutional Credentials
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Professional Title</span>
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                  {profile.title}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#334155] block mb-0.5">Institution</span>
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 font-semibold text-[#0F172A]">
                  {profile.institution}
                </div>
              </div>
            </div>

            {/* Credentials & Expertise Tags */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#334155] block">Credentials &amp; Expertise</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#bfdbfe] bg-[#DBEAFE] px-2.5 py-0.8 text-xs font-semibold text-[#1E40AF]"
                  >
                    <span>{tag}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add field..."
                    className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-xs text-[#0F172A] focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#64748B]" />
                <span>Verified by:</span>
                <span className="font-semibold text-[#0F172A]">{profile.institution}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-[#166534]">
                <Calendar className="h-3.5 w-3.5 text-[#166534]" />
                <span>Verified on Jan 12, 2024</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT STACK (Preferences & Toggles) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Preferences Settings */}
          <Card className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(15,23,42,0.06)] space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                Preferences &amp; System Settings
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#334155] block mb-1">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 font-semibold text-[#0F172A] focus:bg-white outline-none cursor-pointer"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#334155] block mb-1">Notification Settings</label>
                <select
                  value={preferences.notifications}
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.value })}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 font-semibold text-[#0F172A] focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Email Alerts & Synthesis Digest">Email Alerts &amp; Synthesis Digest</option>
                  <option value="Instant Claim Alerts Only">Instant Claim Alerts Only</option>
                  <option value="Weekly Summary Only">Weekly Summary Only</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Email Notifications & Toggles Card */}
          <Card className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(15,23,42,0.06)] space-y-2.5">
            <form onSubmit={handleSavePreferences} className="space-y-3">
              <h3 className="text-xs font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-1.5">
                Email Notifications
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#334155]">Research Updates</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, researchUpdates: !preferences.researchUpdates })}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.researchUpdates ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                    }`}
                    role="switch"
                    aria-checked={preferences.researchUpdates}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.researchUpdates ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#334155]">Weekly Digest</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, weeklyDigest: !preferences.weeklyDigest })}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.weeklyDigest ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                    }`}
                    role="switch"
                    aria-checked={preferences.weeklyDigest}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#334155]">Security Alerts</span>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, securityAlerts: !preferences.securityAlerts })}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.securityAlerts ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                    }`}
                    role="switch"
                    aria-checked={preferences.securityAlerts}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.securityAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="text-right text-[10.5px] font-medium text-[#64748B] pt-0.5">
        Last updated • Sep 5, 2024 • 09:32 AM UTC
      </div>
    </div>
  )
}

export default Profile
