import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  History,
  Bookmark,
  Layers,
  Settings,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { BrandLogo } from './Navbar'
import { useAuth } from '../../auth/useAuth'

export function Sidebar({ className = '', onNavClick }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/app/profile', icon: User },
    { label: 'Research History', path: '/app/history', icon: History },
    { label: 'Saved Research', path: '/app/saved', icon: Bookmark },
    { label: 'Sources', path: '/app/sources', icon: Layers },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ]

  const isActive = (path) => {
    if (path === '/app/dashboard') return location.pathname === '/app/dashboard'
    return location.pathname.startsWith(path)
  }

  // Initials e.g. AB
  const getInitials = (name) => {
    if (!name) return 'AB'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const usernameDisplay = user?.username || (user?.email ? user.email.split('@')[0] : 'alex.bennett')
  const emailDisplay = user?.email || 'alex.bennett@verisearch.ai'

  return (
    <aside
      className={`flex flex-col justify-between w-[260px] lg:w-[270px] shrink-0 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${className}`}
      aria-label="App Sidebar"
    >
      {/* TOP SECTION: Brand & Navigation */}
      <div className="space-y-5">
        {/* Brand Logo */}
        <div className="px-1 pt-0.5">
          <BrandLogo textSize="text-xl" />
        </div>

        {/* Primary CTA Button: New Research */}
        <div>
          <Link
            to="/app/research"
            onClick={onNavClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <Sparkles className="h-4 w-4 transition-transform duration-150 group-hover:scale-110" strokeWidth={2.5} />
            <span>New Research</span>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                    active ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION: User Card */}
      <div className="pt-4">
        {/* User Card Pill matching reference image */}
        <div className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-2.5 border border-slate-200/80 shadow-2xs">
          <Link to="/app/profile" onClick={onNavClick} className="flex items-center gap-2.5 min-w-0 flex-1 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-2xs">
              {getInitials(user?.full_name)}
            </div>
            <div className="min-w-0 pr-1">
              <p className="truncate text-xs font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                {usernameDisplay}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">
                {emailDisplay}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            title="Log Out"
            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

