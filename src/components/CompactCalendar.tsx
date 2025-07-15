"use client"

import { useEffect, useState } from "react"
import { EventRecord, listAllEvents } from "@/lib/adminApi"

export default function CompactCalendar({ events }: { events?: EventRecord[] }) {
  const [data, setData] = useState<EventRecord[]>(events || [])

  useEffect(() => {
    if (!events) {
      listAllEvents().then(setData)
    }
  }, [events])

  const upcoming = [...data]
    .filter(e => new Date(e.date) >= new Date())
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