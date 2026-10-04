import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Check, Menu, X, ArrowRight, ShieldCheck, LogOut, User } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'

export function BrandLogo({ className = '', iconSize = 'h-5 w-5', textSize = 'text-lg' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 font-bold text-slate-900 group ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
        <Check className="h-5 w-5 stroke-[3]" />
      </span>
      <div className="flex flex-col">
        <span className={`tracking-tight ${textSize} font-extrabold text-[#0F172A] leading-none`}>
          VeriSearch<span className="text-[#2563EB]">AI</span>
        </span>
        <span className="text-[9px] font-bold text-[#2563EB] tracking-wider self-end mt-0.5 uppercase bg-[#EFF6FF] px-1 rounded">
          AI
        </span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Features', path: '/features' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
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
