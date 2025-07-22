import Image from 'next/image'
import { listAllUsers } from '@/lib/usersApi'

export const metadata = {
  title: 'Settings – Institution Admin',
}

export default async function SettingsPage() {
  const users = await listAllUsers()
  const user = users[0]

  if (!user) {
    return <div className="p-6">No user information available.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <div className="flex items-center space-x-4">
        <Image
          src="/vercel.svg"
          alt="avatar"
          width={64}
          height={64}
          className="rounded-full border"
        />
        <div>
          <p className="font-medium text-lg">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.institution}</p>
        </div>
      </div>
    </div>
  )
}