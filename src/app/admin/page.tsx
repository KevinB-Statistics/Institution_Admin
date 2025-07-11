import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard – Campus Events',
}

export default function AdminPage() {
  return (
    <div>
      {/* main dashboard area */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Calendar placeholder */}
          <div className="bg-white rounded-lg shadow p-4">Calendar</div>

          {/* Accounts & Billing card */}
          <div className="bg-white rounded-lg shadow p-4 space-y-2">
            <h2 className="font-semibold">Accounts &amp; Billing</h2>
            <p>Balance: $0.00</p>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Pay</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Pay</button>
            </div>
          </div>

          {/* Upcoming Events table */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Upcoming Events</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-1">Event</th>
                  <th className="p-1">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reported Events table */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Reported Events</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-1">Event</th>
                  <th className="p-1">Reports</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}