import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles,
  LayoutDashboard,
  History,
  Bookmark,
  Database,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { BrandLogo } from './Navbar'
import { useAuth } from '../../auth/useAuth'

export function Sidebar({ className = '', onNavClick }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'New Research', path: '/app/research', icon: Sparkles, highlight: true },
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Research History', path: '/app/history', icon: History },
    { label: 'Saved Research', path: '/app/saved', icon: Bookmark },
    { label: 'Sources', path: '/app/sources', icon: Database },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ]

  const isActive = (path) => {
    if (path === '/app/research') return location.pathname === '/app/research'
    if (path === '/app/dashboard') return location.pathname === '/app/dashboard'
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`flex flex-col justify-between w-64 shrink-0 border-r border-slate-200/90 bg-white py-5 px-4 h-screen sticky top-0 ${className}`}
      aria-label="App Sidebar"
    >
      {/* TOP: Brand and Navigation */}
      <div className="space-y-6">
        <div className="px-2">
          <BrandLogo />
        </div>

        <nav className="space-y-1.5" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon

            if (item.highlight) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-blue-600'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-100 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM: User profile & Logout */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
        >
          <span>Landing Page</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
          <div className="min-w-0 pr-2">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.full_name || 'Dr. Alex Bennett'}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {user?.email || 'alex.bennett@verisearch.ai'}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Log out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-xs transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
