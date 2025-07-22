"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  eventId: string
}

export default function EventApprovalButtons({ eventId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function update(status: 'approved' | 'rejected') {
    if (loading) return
    setLoading(true)
    try {
      await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => update('approved')}
        disabled={loading}
        className="px-2 py-1 rounded bg-green-600 text-white disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => update('rejected')}
        disabled={loading}
        className="px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}