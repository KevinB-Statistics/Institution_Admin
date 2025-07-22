import Image from 'next/image'
import { listAllUsers } from '@/lib/usersApi'

export const metadata = {
  title: 'Users – Institution Admin',
}

export default async function UsersPage() {
  const users = await listAllUsers()
  const current = users[0]
  if (!current) {
    return <div className="p-6">No users found.</div>
  }
  const filtered = users.filter(u => u.institution === current.institution)
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Users at {current.institution}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(u => (
          <div key={u.id} className="rounded-lg border bg-white p-4 shadow">
            <Image
              src={u.avatarUrl || '/vercel.svg'}
              alt="avatar"
              width={80}
              height={80}
              className="mx-auto h-20 w-20 rounded-full border"
            />
            <h2 className="mt-3 text-lg font-medium text-center">{u.name}</h2>
            <p className="text-sm text-center text-gray-500">{u.email}</p>
            {u.bio && (
              <p className="mt-2 text-sm text-center text-gray-700">{u.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
