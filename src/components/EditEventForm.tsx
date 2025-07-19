// File: src/components/EditEventForm.tsx

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EventRecord } from '@/lib/types'

interface EditEventFormProps {
  /** The event being edited */
  event: EventRecord
  /** Called when the form should close */
  onClose?: () => void
  /** Called with the updated event after a successful save */
  onSaved?: (event: EventRecord) => void
}

/**
 * A simple editing form for event records. Only a subset of fields are
 * editable by default (title, date and description), but you can extend
 * this component to include more. When submitted the form issues a
 * PUT request to `/api/events/:id` and invokes callbacks on success.
 */
export default function EditEventForm({ event, onClose, onSaved }: EditEventFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: event.title,
    date: event.date,
    description: event.description,
  })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, ...form }),
      })
      if (!res.ok) {
        console.error('Failed to update event:', await res.text())
      } else {
        const updated: EventRecord = await res.json()
        // Notify parent of update
        onSaved?.(updated)
        // Optionally refresh the router so any server components revalidate
        if (typeof router.refresh === 'function') router.refresh()
      }
    } finally {
      setSubmitting(false)
      onClose?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}