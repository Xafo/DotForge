import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
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
      setMessage('Profile updated')
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
      setMessage('Password changed')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!profile) return <p className="text-neutral-600">Loading...</p>

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold">Settings</h2>

      {message && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 rounded-lg p-3">{message}</div>}
      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg p-3">{error}</div>}

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
