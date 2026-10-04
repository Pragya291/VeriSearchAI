import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import {
  User,
  Building,
  CheckCircle2,
  BookOpen,
  Layers,
  Award,
  Link as LinkIcon,
  Plus,
  X,
} from 'lucide-react'

export function Profile() {
  const { user, setUser } = useAuth()

  // Storage key for user-specific extended profile
  const storageKey = `verisearchai:user_profile:${user?.email || 'guest'}`

  const defaultProfile = {
    fullName: user?.full_name || 'Dr. Alex Bennett',
    email: user?.email || 'alex.bennett@verisearch.ai',
    title: 'Senior Research Analyst',
    institution: 'Institute for Evidence & Fact Analysis',
    department: 'Cognitive Science & Public Health Division',
    credentials: 'Ph.D. in Cognitive Neuroscience',
    location: 'Cambridge, MA',
    orcid: '0000-0002-1825-0097',
    website: 'https://verisearch.ai/researchers/alex-bennett',
    bio: 'Dedicated to empirical fact-checking, systematic meta-analyses, and evaluating multi-source scientific literature. Specializes in neurobiology, cognitive longevity, and public health misinformation detection.',
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

  const [newTag, setNewTag] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  const handleSubmit = (e) => {
    e?.preventDefault()
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile))

      // Also sync user session in AuthContext & localStorage
      const updatedUser = {
        ...user,
        full_name: profile.fullName,
        role: profile.title,
      }
      setUser(updatedUser)
      localStorage.setItem('verisearchai:current_user', JSON.stringify(updatedUser))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2800)
    } catch (err) {
      console.error('Failed to save profile', err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col justify-between">
      {/* Page Header - Ultra-compact */}
      <div className="border-b border-slate-200/70 pb-1.5 mb-2 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
            Researcher Profile
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Manage your researcher identity, institution credentials, and verification domains.
          </p>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-3 w-3" />
            Profile Saved
          </span>
        )}
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-3.5 items-start">
        {/* LEFT COLUMN: Profile Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-1.5">
          {/* Card 1: Professional Identification */}
          <Card className="p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Personal & Professional Info
              </h2>
            </div>

            <div className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <Input
                  size="sm"
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Dr. Alex Bennett"
                  required
                />

                <Input
                  size="sm"
                  label="Email Address"
                  value={profile.email}
                  disabled
                  helperText="Registered login email"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <Input
                  size="sm"
                  label="Professional Title / Role"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="e.g. Senior Research Analyst"
                />

                <Input
                  size="sm"
                  label="Academic Credentials"
                  value={profile.credentials}
                  onChange={(e) => setProfile({ ...profile, credentials: e.target.value })}
                  placeholder="e.g. Ph.D. in Cognitive Science"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <Input
                  size="sm"
                  label="Primary Institution"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  placeholder="e.g. University / Research Center"
                />

                <Input
                  size="sm"
                  label="Department / Laboratory"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="e.g. Division of Health Policy"
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Research Biography */}
          <Card className="p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                About & Research Statement
              </h2>
            </div>

            <Textarea
              size="sm"
              rows={2}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell others about your verification methodology, background, published papers, or research focus..."
            />
          </Card>

          {/* Card 3: Research Expertise / Topics (Compact inline chips + adder) */}
          <Card className="p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Fields of Expertise
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {profile.expertise.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-blue-700 border border-blue-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:text-rose-600 cursor-pointer"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="+ Add topic..."
                  className="w-28 sm:w-36 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddTag}
                  className="py-0.5 px-2 text-[10px] h-6"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 4: Academic Links & Identifiers */}
          <Card className="p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1">
              <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Academic Links & Identifiers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <Input
                size="sm"
                label="ORCID Identifier"
                value={profile.orcid}
                onChange={(e) => setProfile({ ...profile, orcid: e.target.value })}
                placeholder="e.g. 0000-0002-1825-0097"
              />

              <Input
                size="sm"
                label="Academic Website / Publications"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </Card>

          {/* Action Button - Always visible without scroll */}
          <div className="flex justify-end pt-0.5">
            <Button type="submit" variant="primary" size="sm" className="py-1.5 px-4 text-xs font-semibold shadow-xs">
              Save Profile Information
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: Live Card Preview */}
        <div className="lg:col-span-5 space-y-2">
          <Card className="p-2.5 sm:p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-1.5 border-slate-200/90">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Public Researcher Card Preview
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9.5px] font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>

            {/* Profile Info Header without any picture */}
            <div className="space-y-0.2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug truncate">
                {profile.fullName || 'Researcher Name'}
              </h3>
              <p className="text-xs font-semibold text-blue-600 truncate">
                {profile.title || 'Research Analyst'}
              </p>
              {profile.credentials && (
                <p className="text-[10.5px] text-slate-500 font-medium truncate">
                  {profile.credentials}
                </p>
              )}
            </div>

            {/* Affiliation & Department */}
            <div className="rounded-lg bg-slate-50/80 p-2 border border-slate-100 space-y-1 text-xs">
              {profile.institution && (
                <div className="flex items-start gap-1.5 text-slate-700">
                  <Building className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold block truncate text-[11.5px]">{profile.institution}</span>
                    {profile.department && (
                      <span className="text-slate-500 block text-[10.5px] truncate">{profile.department}</span>
                    )}
                  </div>
                </div>
              )}
              {profile.orcid && (
                <div className="flex items-center gap-1 pt-0.5 border-t border-slate-200/60 text-slate-500 font-mono text-[9.5px]">
                  <Award className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">ORCID: {profile.orcid}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Research Statement
                </p>
                <p className="text-[11px] text-slate-600 leading-snug italic bg-slate-50/50 p-1.5 rounded-lg border border-slate-100 line-clamp-2">
                  "{profile.bio}"
                </p>
              </div>
            )}

            {/* Fields of Study */}
            {profile.expertise.length > 0 && (
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Research Domains
                </p>
                <div className="flex flex-wrap gap-1">
                  {profile.expertise.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-blue-50/80 px-1.5 py-0.2 text-[10px] font-medium text-blue-700 border border-blue-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats preview */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 text-center">
              <div className="p-1 rounded-lg bg-slate-50">
                <span className="block text-sm font-bold text-slate-900 leading-tight">24</span>
                <span className="text-[9.5px] text-slate-400 font-medium">Claims Verified</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-50">
                <span className="block text-sm font-bold text-blue-600 leading-tight">82%</span>
                <span className="text-[9.5px] text-slate-400 font-medium">Avg Confidence</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
