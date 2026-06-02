import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../config/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

interface ApiKey {
  id: string
  name: string
  prefix: string
  scopes: string[]
  lastUsedAt: string | null
  expiresAt: string | null
  createdAt: string
  isActive: boolean
}

interface CreatedKey {
  id: string
  name: string
  prefix: string
  plainKey: string
  createdAt: string
}

export function ApiKeysPage() {
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<CreatedKey | null>(null)
  const [loading, setLoading] = useState(true)

  const loadKeys = async () => {
    if (!user) return
    const data = await api<ApiKey[]>(`/organizations/${user.currentOrganizationId}/api-keys`)
    setKeys(data)
    setLoading(false)
  }

  useEffect(() => { loadKeys() }, [user?.currentOrganizationId])

  const handleCreate = async () => {
    if (!user || !newKeyName) return
    const data = await api<CreatedKey>(`/organizations/${user.currentOrganizationId}/api-keys`, {
      method: 'POST',
      body: JSON.stringify({ name: newKeyName, scopes: ['all'] }),
    })
    setCreatedKey(data)
    setNewKeyName('')
    loadKeys()
  }

  const handleRevoke = async (keyId: string) => {
    if (!user) return
    await api(`/organizations/${user.currentOrganizationId}/api-keys/${keyId}`, { method: 'DELETE' })
    loadKeys()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) return <p className="text-neutral-600">Loading API keys...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">API Keys</h2>

      {createdKey && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">Key Created</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Copy this key now. You won't be able to see it again.</p>
            <div className="flex gap-2 items-center">
              <code className="flex-1 p-2 bg-neutral-100 dark:bg-neutral-900 rounded text-xs break-all">{createdKey.plainKey}</code>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(createdKey.plainKey)}>Copy</Button>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setCreatedKey(null)}>Done</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="New API key name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleCreate} disabled={!newKeyName}>Create Key</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-sm text-neutral-600">No API keys yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-2 font-medium">Name</th>
                  <th className="text-left py-2 font-medium">Key</th>
                  <th className="text-left py-2 font-medium">Created</th>
                  <th className="text-left py-2 font-medium">Last Used</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-b border-neutral-100 dark:border-neutral-900">
                    <td className="py-2">{key.name}</td>
                    <td className="py-2 font-mono text-xs">{key.prefix}...</td>
                    <td className="py-2 text-neutral-600">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 text-neutral-600">{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}</td>
                    <td className="py-2 text-right">
                      {key.isActive && (
                        <button onClick={() => handleRevoke(key.id)} className="text-xs text-red-600 hover:text-red-500 cursor-pointer">Revoke</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
