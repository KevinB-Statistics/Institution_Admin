import { listFlaggedEvents } from '@/lib/adminApi'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Review – Institution Admin',
}

export default async function ModerationImagesPage() {
  const events = await listFlaggedEvents()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Flagged Event Images</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.filter(e => e.imageUrl).map(e => (
          <div key={e.id} className="rounded-lg border bg-white p-4 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.imageUrl!} alt="event" className="w-full h-40 object-cover rounded" />
            <p className="mt-2 text-sm font-medium">{e.title}</p>
            <form action={`/api/events/${e.id}`} method="post" className="mt-2 space-x-2">
              <input type="hidden" name="status" value="approved" />
              <button formMethod="put" className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
              <button formMethod="delete" className="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
            </form>
          </div>
        ))}
        {events.filter(e => e.imageUrl).length === 0 && (
          <p className="col-span-full text-center text-gray-500">No flagged images</p>
        )}
      </div>
    </div>
  )
}