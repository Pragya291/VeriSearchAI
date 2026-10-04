export default function Button({ children, variant = 'primary', className = '', theme = 'light', ...props }) {
  const isDark = theme === 'dark'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm',
    secondary: isDark ? 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    muted: isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: isDark ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'bg-red-50 text-red-700 hover:bg-red-100',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
