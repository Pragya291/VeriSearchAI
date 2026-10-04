import { Menu } from 'lucide-react'

export default function Header({ title, subtitle, onMenuClick, theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <header className={isDark ? 'sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur md:px-8' : 'sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur md:px-8'}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className={isDark ? 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 shadow-sm xl:hidden' : 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm xl:hidden'}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className={isDark ? 'text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl' : 'text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl'}>{title}</h1>
            {subtitle ? <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>{subtitle}</p> : null}
          </div>
        </div>
      </div>
    </header>
  )
}
