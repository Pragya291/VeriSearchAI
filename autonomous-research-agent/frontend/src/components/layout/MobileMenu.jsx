import { X, FileText, History, LayoutDashboard, LogOut, Search, Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'New Research', to: '/new-research', icon: Search },
  { label: 'Research History', to: '/history', icon: History },
  { label: 'Saved Reports', to: '/saved', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export default function MobileMenu({ open, onClose, theme, user, onLogout, onToggleTheme }) {
  if (!open) return null

  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45 xl:hidden">
      <div className={isDark ? 'h-full w-4/5 max-w-sm border-r border-slate-800 bg-slate-950 p-4' : 'h-full w-4/5 max-w-sm border-r border-slate-200 bg-white p-4'}>
        <div className={isDark ? 'mb-6 flex items-center justify-between border-b border-slate-800 pb-4' : 'mb-6 flex items-center justify-between border-b border-slate-200 pb-4'}>
          <div className="flex items-center gap-3">
            <img 
              src="/verisearch-icon.png" 
              alt="VeriSearch AI" 
              className="h-9 w-9 shrink-0 object-contain rounded-xl"
            />
            <div>
              <p className={isDark ? 'font-bold text-slate-100' : 'font-bold text-slate-900'}>VeriSearch AI</p>
              <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Research &amp; Verification</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={isDark ? 'rounded-lg border border-slate-700 p-2 text-slate-300' : 'rounded-lg border border-slate-200 p-2 text-slate-600'}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                    : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={isDark ? 'mt-6 rounded-xl border border-slate-700 bg-slate-900 p-3' : 'mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3'}>
          <div className="flex items-center gap-3">
            <div className={isDark ? 'flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-200' : 'flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700'}>
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className={isDark ? 'text-sm font-medium text-slate-100' : 'text-sm font-medium text-slate-800'}>{user.full_name}</p>
              <p className={isDark ? 'text-[11px] text-slate-400' : 'text-[11px] text-slate-500'}>{user.email}</p>
            </div>
            <button type="button" onClick={onLogout} aria-label="Log out" title="Log out" className={isDark ? 'ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white' : 'ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900'}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className={isDark ? 'mt-4 flex w-full items-center justify-between rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200' : 'mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700'}
        >
          <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          <span className={isDark ? 'text-xs uppercase text-slate-400' : 'text-xs uppercase text-slate-500'}>{theme === 'dark' ? 'On' : 'Off'}</span>
        </button>
      </div>
    </div>
  )
}
