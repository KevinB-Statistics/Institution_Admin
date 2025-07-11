import { Metadata } from "next"
import Link from "next/link"
import { listAllEvents, EventRecord } from "@/lib/adminApi"

export const metadata: Metadata = {
  title: "Events – Institution Admin",
}

export default async function EventsPage() {
  const events: EventRecord[] = await listAllEvents()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">All Events</h1>
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Organizer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{e.title}</td>
                <td className="px-4 py-2 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-sm capitalize">{e.status}</td>
                <td className="px-4 py-2 text-sm">{e.organizer}</td>
                <td className="px-4 py-2 text-sm">
                  <Link href={`/admin/events/${e.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}