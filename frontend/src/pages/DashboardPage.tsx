import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user?.organizations.find(o => o.id === user?.currentOrganizationId)?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{String(user?.organizations.find(o => o.id === user?.currentOrganizationId)?.role ?? '').toLowerCase()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold truncate">{user?.email}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p>✅ Your account is set up and you're logged in.</p>
          <p>➡️ Invite team members from the <strong>Members</strong> page.</p>
          <p>➡️ Configure billing from the <strong>Billing</strong> page.</p>
          <p>➡️ Generate API keys from the <strong>API Keys</strong> page.</p>
          <p>➡️ Update your profile from the <strong>Settings</strong> page.</p>
        </CardContent>
      </Card>
    </div>
  )
}
