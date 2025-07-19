import { Metadata } from "next"
import Link from "next/link"
import { listTemplateEvents } from "@/lib/adminApi"
import type { EventRecord } from "@/lib/types"

export const metadata: Metadata = {
  title: "Event Templates – Institution Admin",
}

export default async function EventTemplatesPage() {
  const templates: EventRecord[] = await listTemplateEvents()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Event Templates</h1>
      <div className="overflow-auto rounded-lg border bg-white shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Organizer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{t.title}</td>
                <td className="px-4 py-2 text-sm">{t.organizer}</td>
                <td className="px-4 py-2 text-sm">
                  <Link href={`/admin/events/new?template=${t.id}`} className="text-blue-600 hover:underline">
                    Use Template
                  </Link>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}