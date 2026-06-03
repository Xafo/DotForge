import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { api } from '../config/api'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface Subscription {
  status: string
  planId: string | null
  periodEnd: string | null
  isActive: boolean
}

export function BillingPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api<Subscription | null>(`/billing/subscription`).then(setSubscription).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleSubscribe = async () => {
    if (!user) return
    try {
      const { url } = await api<{ url: string }>('/billing/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID || '',
          successUrl: window.location.origin + '/billing',
          cancelUrl: window.location.origin + '/billing',
        }),
      })
      window.location.href = url
    } catch {}
  }

  const handleManageBilling = async () => {
    if (!user) return
    try {
      const { url } = await api<{ url: string }>('/billing/create-portal-session', {
        method: 'POST',
        body: JSON.stringify({ returnUrl: window.location.origin + '/billing' }),
      })
      window.location.href = url
    } catch {}
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('billing.title')}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{t('billing.card_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-600">{t('billing.loading')}</p>
          ) : subscription ? (
            <div className="space-y-2">
              <p className="text-sm">{t('billing.status', { status: subscription.status.toLowerCase() })}</p>
              {subscription.periodEnd && (
                <p className="text-sm">{t('billing.period_ends', { date: new Date(subscription.periodEnd).toLocaleDateString() })}</p>
              )}
              {subscription.isActive ? (
                <Button onClick={handleManageBilling}>{t('billing.manage')}</Button>
              ) : (
                <p className="text-sm text-neutral-600">{t('billing.inactive')}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600">{t('billing.no_subscription')}</p>
              <Button onClick={handleSubscribe}>{t('billing.subscribe')}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
