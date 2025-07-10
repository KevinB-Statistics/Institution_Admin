import React from 'react'
import {getTotalEvents, getUpcomingEvents, getPendingApprovals } from '@/lib/db'

export default async function AdminPage() {
  // fetch data
  const total = await getTotalEvents()
  const upcoming = await getUpcomingEvents()
  const pending = await getPendingApprovals()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card for total events */}
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-lg font-medium">Total Events</h2>
          <p className="text-3xl">{total}</p>
        </div>
        {/* Card for upcoming */}
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-lg font-medium">Upcoming Events</h2>
          <p className="text-3xl">{upcoming}</p>
        </div>
        {/* Card for pending */}
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-lg font-medium">Pending Approvals</h2>
          <p className="text-3xl">{pending}</p>
        </div>
      </div>
    </div>
  )
}