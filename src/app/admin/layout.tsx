import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Admin – Campus Events',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex space-x-4">
        <Link href="/admin" className="font-semibold">Dashboard</Link>
        <Link href="/admin/events" className="font-semibold">Manage Events</Link>
        <Link href="/admin/users" className="font-semibold">Users</Link>
      </nav>
      <main>{children}</main>
    </section>
  )
}