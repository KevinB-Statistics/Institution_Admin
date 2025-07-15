import { Metadata } from "next"
import { listAllEvents, EventRecord } from "@/lib/adminApi"
import CalendarView from "@/components/CalendarView"

export const metadata: Metadata = {
  title: "Calendar – Institution Admin",
}

export default async function CalendarPage() {
  const events: EventRecord[] = await listAllEvents()
  return <CalendarView events={events} />
}
