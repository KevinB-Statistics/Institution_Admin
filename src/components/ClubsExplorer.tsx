// File: src/components/ClubsExplorer.tsx

"use client"

import { useState } from 'react'
import type { ClubRecord } from '@/lib/types'
import CreateClubModal from './CreateClubModal'
import EditClubModal from './EditClubModal'

interface ClubsExplorerProps {
  clubs: ClubRecord[]
}

/**
 * Client component for exploring and managing clubs. Displays a list of
 * clubs with options to create new clubs, edit existing ones and delete
 * them. Uses modal dialogs for creation and editing.
 */
export default function ClubsExplorer({ clubs }: ClubsExplorerProps) {
  const [clubsList, setClubsList] = useState(clubs)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ClubRecord | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this club?')) return
    await fetch(`/api/clubs/${id}`, { method: 'DELETE' })
    setClubsList(list => list.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Clubs</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
        >
          + New Club
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubsList.map(club => (
          <div key={club.id} className="relative rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">{club.name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-3">{club.description}</p>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>{club.members?.length ?? 0} members</span>
              <span>{club.events?.length ?? 0} events</span>
            </div>
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => setEditing(club)}
                className="text-blue-600 hover:text-blue-800 text-sm"
                aria-label={`Edit ${club.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(club.id)}
                className="text-red-600 hover:text-red-800 text-sm"
                aria-label={`Delete ${club.name}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {clubsList.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No clubs found.</div>
        )}
      </div>
      <CreateClubModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(club) => setClubsList(list => [...list, club])}
      />
      <EditClubModal
        club={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => setClubsList(list => list.map(c => c.id === updated.id ? updated : c))}
      />
    </div>
  )
}