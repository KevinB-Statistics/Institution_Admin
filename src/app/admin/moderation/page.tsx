import { listFlaggedEvents } from '@/lib/adminApi'
import { listFlaggedComments } from '@/lib/commentsApi'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moderation – Institution Admin',
}

export default async function ModerationPage() {
  const [events, comments] = await Promise.all([
    listFlaggedEvents(),
    listFlaggedComments(),
  ])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Flagged Items</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Events</h2>
        <div className="overflow-auto rounded-lg border bg-white shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Reports</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{e.title}</td>
                  <td className="px-4 py-2 text-sm">{e.reportCount ?? 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <form action={`/api/events/${e.id}`} method="post">
                      <input type="hidden" name="status" value="approved" />
                      <button className="mr-2 px-2 py-1 bg-green-600 text-white rounded" formMethod="put">Approve</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded" formMethod="delete">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                    No flagged events
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Comments</h2>
        <div className="overflow-auto rounded-lg border bg-white shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Author</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Comment</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Reports</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {comments.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{c.author}</td>
                  <td className="px-4 py-2 text-sm max-w-xs truncate">{c.text}</td>
                  <td className="px-4 py-2 text-sm">{c.reportCount ?? 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <form action={`/api/comments/${c.id}`} method="post">
                      <input type="hidden" name="status" value="approved" />
                      <button className="mr-2 px-2 py-1 bg-green-600 text-white rounded" formMethod="put">Approve</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded" formMethod="delete">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                    No flagged comments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}