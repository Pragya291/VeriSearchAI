import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

const THEME_STORAGE_KEY = 'verisearchai:theme'

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
})

function getSystemPreference() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme() {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // fallback
  }
  return 'system'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState(getSystemPreference)

  // Listen to OS theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') return systemTheme
    return theme
  }, [theme, systemTheme])

  const isDark = resolvedTheme === 'dark'

  // Apply theme to document root
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (isDark) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }

    // Synchronize meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0B0F19' : '#2563EB')
    }
  }, [isDark])

  const setTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // ignore
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, isDark, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
