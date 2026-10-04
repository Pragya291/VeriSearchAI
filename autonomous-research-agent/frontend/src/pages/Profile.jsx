import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import {
  User,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Globe,
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
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-slate-200/70 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Researcher Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add information about yourself, your research focus, affiliation, and academic credentials.
          </p>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Profile Saved Successfully
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Professional Identification */}
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Personal & Professional Info</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Dr. Alex Bennett"
                  required
                />

                <Input
                  label="Email Address"
                  value={profile.email}
                  disabled
                  helperText="Registered login email"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Professional Title / Role"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="e.g. Senior Research Analyst"
                />

                <Input
                  label="Academic Degrees / Credentials"
                  value={profile.credentials}
                  onChange={(e) => setProfile({ ...profile, credentials: e.target.value })}
                  placeholder="e.g. Ph.D. in Cognitive Science"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Institution / Organization"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  placeholder="e.g. University / Research Center"
                />

                <Input
                  label="Department / Laboratory"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="e.g. Division of Health Policy"
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Research Biography */}
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">About & Research Statement</h2>
            </div>

            <Textarea
              label="Bio / Research Background"
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell others about your verification methodology, background, published papers, or research focus..."
              helperText="Brief summary visible on your research dossiers."
            />
          </Card>

          {/* Card 3: Research Expertise / Topics */}
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <Layers className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Fields of Expertise</h2>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Add relevant disciplines, topics, or scientific domains you investigate.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.expertise.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:text-rose-600 cursor-pointer"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
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
                placeholder="Add expertise (e.g. Epidemiology, AI Ethics...)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </Card>

          {/* Card 4: Academic Links & Identifiers */}
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-5">
              <LinkIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Academic Links & Identifiers</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ORCID Identifier"
                value={profile.orcid}
                onChange={(e) => setProfile({ ...profile, orcid: e.target.value })}
                placeholder="e.g. 0000-0002-1825-0097"
              />

              <Input
                label="Academic Website / Publications Link"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="lg">
              Save Profile Information
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: Live Card Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Public Researcher Card Preview
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Verified Researcher
              </span>
            </div>

            {/* Profile Info Header without any picture */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                {profile.fullName || 'Researcher Name'}
              </h3>
              <p className="text-sm font-semibold text-blue-600">
                {profile.title || 'Research Analyst'}
              </p>
              {profile.credentials && (
                <p className="text-xs text-slate-500 font-medium">
                  {profile.credentials}
                </p>
              )}
            </div>

            {/* Affiliation & Department */}
            <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-2 text-xs">
              {profile.institution && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{profile.institution}</span>
                    {profile.department && (
                      <span className="text-slate-500 block">{profile.department}</span>
                    )}
                  </div>
                </div>
              )}
              {profile.orcid && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-slate-500 font-mono text-[11px]">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>ORCID: {profile.orcid}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Research Statement
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  "{profile.bio}"
                </p>
              </div>
            )}

            {/* Fields of Study */}
            {profile.expertise.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Research Domains
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.expertise.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-blue-50/80 px-2.5 py-0.8 text-xs font-medium text-blue-700 border border-blue-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats preview */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="block text-lg font-bold text-slate-900">24</span>
                <span className="text-[11px] text-slate-400 font-medium">Claims Verified</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="block text-lg font-bold text-blue-600">82%</span>
                <span className="text-[11px] text-slate-400 font-medium">Avg Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
