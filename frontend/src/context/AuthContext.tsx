import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api } from '../config/api'

interface Organization {
  id: string
  name: string
  slug: string
  role: string | number
}

export interface AuthState {
  userId: string
  email: string
  name: string
  avatarUrl: string | null
  accessToken: string
  currentOrganizationId: string
  organizations: Organization[]
}

interface AuthContextType {
  user: AuthState | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  switchOrganization: (orgId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem('auth_state')
    return stored ? JSON.parse(stored) : null
  })

  const updateUser = (data: AuthState) => {
    localStorage.setItem('auth_state', JSON.stringify(data))
    localStorage.setItem('access_token', data.accessToken)
    setUser(data)
  }

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<AuthState>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    updateUser(data)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const data = await api<AuthState>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    updateUser(data)
  }, [])

  const logout = useCallback(async () => {
    try { await api('/auth/logout', { method: 'POST' }) } catch {}
    localStorage.clear()
    setUser(null)
  }, [])

  const switchOrganization = useCallback(async (orgId: string) => {
    const data = await api<AuthState>('/organizations/switch', {
      method: 'POST',
      body: JSON.stringify({ organizationId: orgId }),
    })
    updateUser(data)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchOrganization }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
