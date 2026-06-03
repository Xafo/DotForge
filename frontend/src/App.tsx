import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'
import { DashboardLayout } from './components/DashboardLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { OAuthCallbackPage } from './pages/OAuthCallbackPage'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { MembersPage } from './pages/MembersPage'
import { BillingPage } from './pages/BillingPage'
import { ApiKeysPage } from './pages/ApiKeysPage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <DashboardLayout>{children}</DashboardLayout>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/app" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <I18nProvider>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/auth/callback/:provider" element={<PublicRoute><OAuthCallbackPage /></PublicRoute>} />
          <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/app/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
          <Route path="/app/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
          <Route path="/app/api-keys" element={<ProtectedRoute><ApiKeysPage /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
      </I18nProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
