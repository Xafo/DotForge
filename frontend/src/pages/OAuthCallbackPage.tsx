import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { api } from '../config/api'

export function OAuthCallbackPage() {
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!provider) return

    const code = searchParams.get('code')
    if (!code) {
      setError(t('oauth.no_code'))
      return
    }

    const redirectUri = `${window.location.origin}/auth/callback/${provider}`

    api<{ userId: string; accessToken: string }>(`/auth/oauth/${provider}/callback`, {
      method: 'POST',
      body: JSON.stringify({ code, redirectUri }),
    })
      .then((data) => {
        localStorage.setItem('access_token', data.accessToken)
        window.location.href = '/app'
      })
      .catch((err) => {
        setError(err.message || t('oauth.failed'))
      })
  }, [provider])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button onClick={() => navigate('/login')} className="text-sm underline">{t('oauth.back')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-neutral-600">{t('oauth.completing', { provider: provider ?? '' })}</p>
    </div>
  )
}
