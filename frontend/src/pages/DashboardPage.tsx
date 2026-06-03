import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { api } from '../config/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface DashboardData {
  organizationName: string
  organizationSlug: string
  role: string
  memberCount: number
  pendingInvitations: number
  apiKeyCount: number
  activeApiKeys: number
  subscription: { status: string; planId: string | null; periodEnd: string | null; isActive: boolean } | null
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { t } = useI18n()

  useEffect(() => {
    api<DashboardData>('/dashboard')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('dashboard.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader><CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">&nbsp;</CardTitle></CardHeader>
              <CardContent><div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('dashboard.title')}</h2>
        <Card>
          <CardContent className="py-8 text-center text-neutral-600 dark:text-neutral-400">
            {t('dashboard.error_prefix')} {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  const isNewOrg = data && data.memberCount <= 1 && data.apiKeyCount === 0 && !data.subscription?.isActive

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('dashboard.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">{t('dashboard.org')}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-bold truncate">{data?.organizationName}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{data?.organizationSlug}</p>
          </CardContent>
        </Card>

        <Link to="/app/members" className="block">
          <Card className="transition-colors hover:border-brand-500/40 cursor-pointer">
            <CardHeader><CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">{t('dashboard.members')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{data?.memberCount}</p>
              {data && data.pendingInvitations > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  {data.pendingInvitations === 1
                    ? t('dashboard.pending', { n: data.pendingInvitations })
                    : t('dashboard.pending_plural', { n: data.pendingInvitations })}
                </p>
              )}
              <p className="text-xs text-neutral-500 mt-0.5">{t('dashboard.your_role', { role: String(data?.role ?? '').toLowerCase() })}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/api-keys" className="block">
          <Card className="transition-colors hover:border-brand-500/40 cursor-pointer">
            <CardHeader><CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">{t('dashboard.api_keys')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{data?.apiKeyCount}</p>
              {data && data.activeApiKeys > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">{t('dashboard.active_keys', { n: data.activeApiKeys })}</p>
              )}
              <p className="text-xs text-neutral-500 mt-0.5">{t('dashboard.total_keys')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/billing" className="block">
          <Card className="transition-colors hover:border-brand-500/40 cursor-pointer">
            <CardHeader><CardTitle className="text-sm text-neutral-600 dark:text-neutral-400">{t('dashboard.billing')}</CardTitle></CardHeader>
            <CardContent>
              {data?.subscription?.isActive ? (
                <>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{t('dashboard.active')}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 capitalize">{data.subscription.status}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-neutral-400">{t('dashboard.free')}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{t('dashboard.no_plan')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {isNewOrg && (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.getting_started')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
            <p>{t('dashboard.gs_logged_in')}</p>
            <p>{t('dashboard.gs_invite')}</p>
            <p>{t('dashboard.gs_billing')}</p>
            <p>{t('dashboard.gs_apikeys')}</p>
            <p>{t('dashboard.gs_profile')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
