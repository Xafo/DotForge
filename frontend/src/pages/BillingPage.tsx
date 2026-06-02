import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
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
      <h2 className="text-2xl font-bold">Billing</h2>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-600">Loading...</p>
          ) : subscription ? (
            <div className="space-y-2">
              <p className="text-sm">Status: <span className="font-medium capitalize">{subscription.status.toLowerCase()}</span></p>
              {subscription.periodEnd && (
                <p className="text-sm">Period ends: {new Date(subscription.periodEnd).toLocaleDateString()}</p>
              )}
              {subscription.isActive ? (
                <Button onClick={handleManageBilling}>Manage billing</Button>
              ) : (
                <p className="text-sm text-neutral-600">Your subscription is not active.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600">No subscription yet.</p>
              <Button onClick={handleSubscribe}>Subscribe</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
