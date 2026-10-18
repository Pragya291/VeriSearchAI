import { Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle({ showModes = false, className = '' }) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  if (showModes) {
    const modes = [
      { id: 'light', label: 'Light', icon: Sun },
      { id: 'dark', label: 'Dark', icon: Moon },
      { id: 'system', label: 'System', icon: Laptop },
    ]

    return (
      <div className={`inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/80 ${className}`}>
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = theme === mode.id
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setTheme(mode.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{mode.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${className}`}
      title={`Current: ${theme} (showing ${resolvedTheme}). Click to toggle.`}
      aria-label="Toggle theme appearance"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4 text-blue-400" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500" />
      )}
    </button>
  )
}

export default ThemeToggle
