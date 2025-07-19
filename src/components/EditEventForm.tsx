"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EventRecord } from '@/lib/types'

export default function EditEventForm({
  event,
  onSaved,
}: {
  event: EventRecord
  onSaved?: (e: EventRecord) => void
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: event.title,
    date: event.date,
    description: event.description,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, ...form }),
    })
     if (res.ok) {
      const updated = (await res.json()) as EventRecord
      onSaved?.(updated)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  )
}