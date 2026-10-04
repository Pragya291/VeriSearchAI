import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppLayout } from './components/layout/AppLayout'

// Public Pages
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { Features } from './pages/Features'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

// Protected Application Pages
import { Dashboard } from './pages/Dashboard'
import { Research } from './pages/Research'
import { Results } from './pages/Results'
import { History } from './pages/History'
import { SavedResearch } from './pages/SavedResearch'
import { Sources } from './pages/Sources'
import { Settings } from './pages/Settings'
import { Profile } from './pages/Profile'

import { useAuth } from './auth/useAuth'

function RootGateway() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-700">Loading VeriSearchAI...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

function PageMetadata() {
  const location = useLocation()

  useEffect(() => {
    const titles = {
      '/': 'Log In | VeriSearchAI',
      '/home': 'VeriSearchAI — AI Research & Fact Verification',
      '/how-it-works': 'How It Works | VeriSearchAI',
      '/features': 'Features & Trust Tools | VeriSearchAI',
      '/login': 'Log In | VeriSearchAI',
      '/signup': 'Create Account | VeriSearchAI',
      '/app': 'Research Dashboard | VeriSearchAI',
      '/app/dashboard': 'Research Dashboard | VeriSearchAI',
      '/app/research': 'New Research Investigation | VeriSearchAI',
      '/app/history': 'Research History | VeriSearchAI',
      '/app/saved': 'Saved Research Reports | VeriSearchAI',
      '/app/sources': 'Evaluated Sources | VeriSearchAI',
      '/app/settings': 'Platform Settings | VeriSearchAI',
      '/app/profile': 'Researcher Profile | VeriSearchAI',
    }

    if (location.pathname.startsWith('/app/results/') || location.pathname.startsWith('/app/report/')) {
      document.title = 'Verification Results | VeriSearchAI'
    } else {
      document.title = titles[location.pathname] || 'VeriSearchAI — AI Research & Fact Verification'
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageMetadata />
        <Routes>
          {/* Initial Entry Route: Starts at Login/Signup page */}
          <Route path="/" element={<RootGateway />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Marketing & Informational Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />

          {/* Protected Application Routes under /app */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="research" element={<Research />} />
            <Route path="results/:id" element={<Results />} />
            <Route path="report/:id" element={<Results />} />
            <Route path="history" element={<History />} />
            <Route path="saved" element={<SavedResearch />} />
            <Route path="sources" element={<Sources />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback routes */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          <Route path="/new-research" element={<Navigate to="/app/research" replace />} />
          <Route path="/history" element={<Navigate to="/app/history" replace />} />
          <Route path="/saved" element={<Navigate to="/app/saved" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
