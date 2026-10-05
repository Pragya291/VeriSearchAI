import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Check, Menu, X, ArrowRight, LogOut, User } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'

export function BrandIcon({ className = 'h-9 w-9', alt = 'VeriSearch AI' }) {
  return (
    <img 
      src="/verisearch-icon.png" 
      alt={alt}
      className={`shrink-0 object-contain rounded-xl transition-transform duration-200 group-hover:scale-105 ${className}`} 
      loading="eager"
    />
  )
}

export function BrandLogo({ 
  className = '', 
  iconSize = 'h-9 w-9', 
  textSize = 'text-lg',
  compact = false,
  stacked = false,
  theme = 'light',
  to
}) {
  const { user } = useAuth()
  const targetLink = to !== undefined ? to : (user ? "/app/dashboard" : "/home")

  if (compact) {
    return (
      <Link 
        to={targetLink} 
        className={`inline-flex items-center group ${className}`}
        aria-label="VeriSearch AI"
      >
        <BrandIcon className={iconSize} />
      </Link>
    )
  }

  if (stacked) {
    return (
      <Link 
        to={targetLink} 
        className={`inline-flex flex-col items-center gap-3 group text-center ${className}`}
        aria-label="VeriSearch AI"
      >
        <BrandIcon className={iconSize} />
        <span className={`font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} ${textSize} leading-none`}>
          VeriSearch AI
        </span>
      </Link>
    )
  }

  return (
    <Link 
      to={targetLink} 
      className={`inline-flex items-center gap-3 font-bold group ${className}`}
      aria-label="VeriSearch AI"
    >
      <BrandIcon className={iconSize} />
      <span className={`tracking-tight ${textSize} font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} leading-none`}>
        VeriSearch AI
      </span>
    </Link>
  )
}

export function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Features', path: '/features' },
  ]

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home' || location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <BrandLogo />
        </div>

        {/* CENTER: Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                <span>Go to App</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Log Out"
                className="rounded-xl border border-slate-200/90 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>{user.full_name || user.email}</span>
                </div>
                <Link
                  to="/app/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full text-center rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
