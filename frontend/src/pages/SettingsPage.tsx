import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { api } from '../config/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface Profile {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt: string
}

export function SettingsPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    api<Profile>('/user/profile').then((data) => {
      setProfile(data)
      setName(data.name)
    }).catch(() => {})
  }, [user])

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const data = await api<Profile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, avatarUrl: profile?.avatarUrl }),
      })
      setProfile(data)
      setMessage(t('settings.profile_updated'))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api('/user/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setCurrentPassword('')
      setNewPassword('')
      setMessage(t('settings.password_changed'))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!profile) return <p className="text-neutral-600">{t('settings.loading')}</p>

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold">{t('settings.title')}</h2>

      {message && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-lg p-3">{message}</div>}
      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg p-3">{error}</div>}

      <Card>
        <CardHeader><CardTitle>{t('settings.profile_card')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.email_label')}</label>
              <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.name_label')}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <Button type="submit">{t('settings.save')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t('settings.password_card')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.current_password')}</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.new_password')}</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit">{t('settings.change_password')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
