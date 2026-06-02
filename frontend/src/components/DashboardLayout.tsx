import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/app', label: 'Dashboard', icon: '▦' },
  { path: '/app/members', label: 'Members', icon: '👥' },
  { path: '/app/billing', label: 'Billing', icon: '💳' },
  { path: '/app/api-keys', label: 'API Keys', icon: '🔑' },
  { path: '/app/settings', label: 'Settings', icon: '⚙️' },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, switchOrganization } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-lg font-bold">DotForge</h1>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path))
                  ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          {user && user.organizations.length > 1 && (
            <select
              value={user.currentOrganizationId}
              onChange={(e) => switchOrganization(e.target.value)}
              className="w-full text-sm rounded-lg border border-neutral-200 px-2 py-1.5 bg-white dark:bg-neutral-950 dark:border-neutral-800"
            >
              {user.organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{user?.name}</span>
            <button onClick={handleLogout} className="text-xs text-red-600 hover:text-red-500 cursor-pointer">Logout</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
