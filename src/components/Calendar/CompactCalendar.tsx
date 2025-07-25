"use client"

import { useEffect, useState } from "react"
import type { EventRecord } from "@/lib/types"

export default function CompactCalendar({ events }: { events?: EventRecord[] }) {
  const [data, setData] = useState<EventRecord[]>(events?.filter(e => e.status === 'approved') || [])

  useEffect(() => {
    if (!events) {
      fetch("/api/events")
        .then((res) => res.json())
        .then((all: EventRecord[]) => setData(all.filter(e => e.status === 'approved')))
    }
  }, [events])

  const upcoming = [...data]
    .filter(e => e.status === 'approved' && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <ul className="mt-2 text-xs space-y-1">
      {upcoming.map(e => (
        <li key={e.id} className="flex justify-between">
          <span className="truncate">{e.title}</span>
          <span className="ml-2 text-gray-500">
            {new Date(e.date).toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            })}
          </span>
        </li>
      ))}
      {upcoming.length === 0 && <li>No upcoming events</li>}
    </ul>
  )
}