import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { User, Sliders, CheckCircle2 } from 'lucide-react'

export function Settings() {
  const { user } = useAuth()

  // Local settings state
  const [fullName, setFullName] = useState(user?.full_name || 'Dr. Alex Bennett')
  const [email] = useState(user?.email || 'alex.bennett@verisearch.ai')
  const [depth, setDepth] = useState('Standard')
  const [citationStyle, setCitationStyle] = useState('APA 7th Edition')
  const [notifications, setNotifications] = useState({
    researchComplete: true,
    contradictionAlerts: true,
    weeklyDigest: false,
  })
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e) => {
    e?.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200/70 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Platform Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your researcher profile and retrieval preferences.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Preferences Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* =================================================== */}
        {/* PROFILE                                             */}
        {/* =================================================== */}
        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Researcher Profile</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={fullName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-100"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl">
                  {fullName[0]}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Profile Picture</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Avatar is synced with your verified institution credentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input label="Email Address" value={email} disabled helperText="Managed by account owner" />
          </div>
        </Card>

        {/* =================================================== */}
        {/* PREFERENCES                                         */}
        {/* =================================================== */}
        <Card>
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Research & Output Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Default Search Depth"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              options={['Quick (Rapid Synthesis)', 'Standard (Broad Evaluation)', 'Deep (Exhaustive Meta-Analysis)']}
            />

            <Select
              label="Citation & Export Format"
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value)}
              options={['APA 7th Edition', 'IEEE Standard', 'Chicago Manual of Style', 'MLA 9th Edition']}
            />
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Notifications & Alerts
            </p>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-slate-800">Verification Completion Alert</p>
                <p className="text-xs text-slate-500">Notify when an autonomous search concludes.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.researchComplete}
                onChange={(e) =>
                  setNotifications({ ...notifications, researchComplete: e.target.checked })
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-slate-800">High Contradiction Warnings</p>
                <p className="text-xs text-slate-500">Flag severe conflicting data from high-credibility sources.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.contradictionAlerts}
                onChange={(e) =>
                  setNotifications({ ...notifications, contradictionAlerts: e.target.checked })
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
