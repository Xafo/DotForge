import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { api } from '../config/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface Member {
  userId: string
  email: string
  name: string
  role: string
  joinedAt: string
}

export function MembersPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [members, setMembers] = useState<Member[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadMembers = async () => {
    if (!user) return
    try {
      const data = await api<Member[]>(`/organizations/${user.currentOrganizationId}/members`)
      setMembers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMembers() }, [user?.currentOrganizationId])

  const handleInvite = async () => {
    if (!user) return
    try {
      await api(`/organizations/${user.currentOrganizationId}/members/invite`, {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail }),
      })
      setInviteEmail('')
      loadMembers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleRemove = async (userId: string) => {
    if (!user) return
    try {
      await api(`/organizations/${user.currentOrganizationId}/members/${userId}`, { method: 'DELETE' })
      loadMembers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-neutral-600">{t('members.loading')}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('members.title')}</h2>

      {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg p-3">{error}</div>}

      <div className="flex gap-2">
        <Input
          placeholder={t('members.invite_placeholder')}
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleInvite}>{t('members.invite_btn')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('members.card_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="text-left py-2 font-medium">{t('members.col_name')}</th>
                <th className="text-left py-2 font-medium">{t('members.col_email')}</th>
                <th className="text-left py-2 font-medium">{t('members.col_role')}</th>
                <th className="text-left py-2 font-medium">{t('members.col_joined')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.userId} className="border-b border-neutral-100 dark:border-neutral-900">
                  <td className="py-2">{m.name}</td>
                  <td className="py-2 text-neutral-600">{m.email}</td>
                  <td className="py-2 capitalize">{m.role.toLowerCase()}</td>
                  <td className="py-2 text-neutral-600">{new Date(m.joinedAt).toLocaleDateString()}</td>
                  <td className="py-2 text-right">
                    {m.userId !== user?.userId && (
                      <button onClick={() => handleRemove(m.userId)} className="text-xs text-red-600 hover:text-red-500 cursor-pointer">{t('members.remove')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
