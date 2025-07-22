import { useEffect, useState } from 'react'
import type { UserRecord } from '@/lib/types'

/**
 * Fetches the first user from `/api/users` and returns it. This is a
 * very naive implementation used for demo purposes until a proper
 * authentication system is in place.
 */
export default function useCurrentUser() {
  const [user, setUser] = useState<UserRecord | null>(null)

  useEffect(() => {
    fetch('/api/users')
      .then((r) => (r.ok ? r.json() : []))
      .then((users: UserRecord[]) => {
        setUser(users[0] ?? null)
      })
      .catch(() => setUser(null))
  }, [])

  return user
}