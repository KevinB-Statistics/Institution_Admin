// File: src/components/EditClubForm.tsx

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ClubRecord } from '@/lib/types'

interface EditClubFormProps {
  club: ClubRecord
  onSaved?: (club: ClubRecord) => void
  onClose?: () => void
}

/**
 * Form component for editing an existing club. It allows updating the
 * club's name and description. After a successful update the parent
 * component is notified and the modal is closed. Duplicate submissions
 * are prevented by a `submitting` flag.
 */
export default function EditClubForm({ club, onSaved, onClose }: EditClubFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({ name: club.name, description: club.description })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/clubs/${club.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      if (!res.ok) {
        console.error('Failed to update club:', await res.text())
      } else {
        const updated: ClubRecord = await res.json()
        onSaved?.(updated)
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Club Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
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
          required
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