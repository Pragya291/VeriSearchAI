import { NavLink } from 'react-router-dom'
import { FileText, History, LayoutDashboard, LogOut, Moon, Search, Settings, SunMedium, User } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'New Research', to: '/new-research', icon: Search },
  { label: 'Research History', to: '/history', icon: History },
  { label: 'Saved Reports', to: '/saved', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export default function Sidebar({ theme, user, onLogout, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <aside className={isDark ? 'hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/85 backdrop-blur xl:flex xl:flex-col' : 'hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur xl:flex xl:flex-col'}>
      <div className={isDark ? 'border-b border-slate-800 px-6 py-6' : 'border-b border-slate-200 px-6 py-6'}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
            VS
          </div>
          <div>
            <p className={isDark ? 'text-lg font-semibold text-slate-100' : 'text-lg font-semibold text-slate-900'}>VeriSearchAI</p>
            <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Research &amp; Verification</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? isDark ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={isDark ? 'border-t border-slate-800 p-4' : 'border-t border-slate-200 p-4'}>
        <div className={isDark ? 'mb-4 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-3' : 'mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3'}>
          <div className="flex items-center gap-3">
            <div className={isDark ? 'flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-200' : 'flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700'}>
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className={isDark ? 'text-sm font-medium text-slate-100' : 'text-sm font-medium text-slate-800'}>{user.full_name}</p>
              <p className={isDark ? 'text-[11px] text-slate-400' : 'text-[11px] text-slate-500'}>{user.email}</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} aria-label="Log out" title="Log out" className={isDark ? 'rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white' : 'rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900'}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className={isDark ? 'mb-3 flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800' : 'mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50'}
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            Theme
          </span>
          <span className={isDark ? 'text-xs uppercase tracking-wide text-slate-400' : 'text-xs uppercase tracking-wide text-slate-500'}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>

        <div className={isDark ? 'text-center text-[11px] text-slate-500' : 'text-center text-[11px] text-slate-500'}>Version 2.4.1</div>
      </div>
    </aside>
  )
}
