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
      <nav className="bg-white shadow p-4 flex flex-wrap gap-4">
        <Link href="/admin" className="font-semibold">Dashboard</Link>
        <Link href="/admin/events" className="font-semibold">Manage Events</Link>
        <Link href="/admin/clubs" className="font-semibold">Manage Clubs</Link>
        <Link href="/admin/statistics" className="font-semibold">Statistics</Link>
        <Link href="/admin/calendar" className="font-semibold">Calendar</Link>
        <Link href="/admin/users" className="font-semibold">Users</Link>
        <Link href="/admin/settings" className="font-semibold">Settings</Link>
      </nav>
      <main>{children}</main>
    </section>
  )
}