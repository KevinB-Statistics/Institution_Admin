// File: src/app/admin/events/page.tsx
import { Metadata } from "next"
import { listAllEvents, EventRecord } from "@/lib/adminApi"
import EventsExplorer from "@/components/EventsExplorer"

export const metadata: Metadata = {
  title: "Events – Institution Admin",
}

export default async function EventsPage() {
  // Fetch all events on the server
  const events: EventRecord[] = await listAllEvents()

  return (
    <section className="p-5 bg-gray-50 min-h-screen">
      {/* Pass the data into our client-side explorer */}
      <EventsExplorer events={events} />
    </section>
  )
}
