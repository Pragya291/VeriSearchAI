export default function Modal({ open, title, children, onClose, theme = 'light' }) {
  if (!open) return null
  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className={isDark ? 'w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-xl' : 'w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl'}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className={isDark ? 'rounded-lg border border-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-800' : 'rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50'}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
