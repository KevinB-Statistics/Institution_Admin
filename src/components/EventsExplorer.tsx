// File: src/components/EventsExplorer.tsx
"use client"

import React, { useState, Fragment } from "react"
import { Tab } from "@headlessui/react"
import Link from "next/link"
import type { EventRecord } from "@/lib/types"
import { Grid, List, Menu } from "lucide-react"

type ViewMode = "cards" | "list" | "compact"
type SortKey  = "date" | "title"

const TABS = ["All Events", "Pending", "Templates"] as const
type TabKey = typeof TABS[number]

const MODE_CONFIG: Record<ViewMode, { label: string; Icon: React.FC<any> }> = {
  cards:   { label: "Card View",    Icon: Grid },
  list:    { label: "List View",    Icon: List },
  compact: { label: "Compact View", Icon: Menu },
}

const statusStyles: Record<string,string> = {
  approved: "bg-green-100 text-green-800",
  pending:  "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  template: "bg-gray-100 text-gray-800",
}

export default function EventsExplorer({ events }: { events: EventRecord[] }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>("All Events")
  const [mode,        setMode]        = useState<ViewMode>("cards")
  const [query,       setQuery]       = useState("")
  const [sortKey,     setSortKey]     = useState<SortKey>("date")

  // 1) filter by tab
  const filteredByTab = events.filter(e => {
    if (selectedTab === "All Events") return true
    if (selectedTab === "Pending")    return e.status === "pending"
    if (selectedTab === "Templates")  return e.status === "template"
    return true
  })

  // 2) search + sort
  const filtered = filteredByTab
    .filter(e => e.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortKey === "date"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : a.title.localeCompare(b.title)
    )

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      {/* ─── Tabs & Toolbar ───────────────────────────────────── */}
      <Tab.Group
  selectedIndex={TABS.indexOf(selectedTab)}
  onChange={i => setSelectedTab(TABS[i])}
>
  <div className="flex flex-wrap items-center justify-between gap-4">
    {/* Tabs */}
    <Tab.List className="inline-flex overflow-hidden rounded-lg bg-white border">
      {TABS.map(tab => (
        <Tab as={Fragment} key={tab}>
          {({ selected }) => (
            <button
              className={`px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          )}
        </Tab>
      ))}
    </Tab.List>

    {/* Right Controls: View Modes + Plus Button */}
    <div className="flex items-center gap-2 flex-wrap">
      {/* View Mode Toggle */}
      <div className="inline-flex overflow-hidden rounded-full border bg-white">
        {(Object.keys(MODE_CONFIG) as ViewMode[]).map(m => {
          const { label, Icon } = MODE_CONFIG[m]
          const active = mode === m
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Plus Button */}
      <Link
        href="/admin/events/create"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow"
        aria-label="Create new event"
      >
        +
      </Link>
    </div>
  </div>

  {/* Search + Sort remains below */}
  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search events..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={sortKey}
        onChange={e => setSortKey(e.target.value as SortKey)}
        className="border border-gray-300 rounded-xl px-3 py-2 shadow-sm"
      >
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
      </select>
    </div>
  </div>
</Tab.Group>

      {/* ─── Content ─────────────────────────────────────────── */}
      {mode === "cards"   && <CardView    events={filtered} />}
      {mode === "list"    && <ListView    events={filtered} />}
      {mode === "compact" && <CompactView events={filtered} />}
    </div>
  )
}


function CardView({ events }: { events: EventRecord[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map(e => (
        <div
          key={e.id}
          className="relative bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-1 truncate">
            {e.title}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(e.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <span
            className={`
              inline-block px-3 py-1 rounded-full text-xs font-medium
              ${statusStyles[e.status]}
            `}
          >
            {e.status.toUpperCase()}
          </span>
          <p className="mt-3 text-sm text-gray-700">
            Organizer: <span className="font-medium">{e.organizer}</span>
          </p>
          <Link
            href={`/admin/events/${e.id}/edit`}
            className="absolute top-6 right-6 text-blue-600 hover:text-blue-800 transition"
            aria-label={`Edit ${e.title}`}
          >
            ✎
          </Link>
        </div>
      ))}
      {events.length === 0 && (
        <div className="col-span-full text-center py-20 text-gray-500">
          No events found.
        </div>
      )}
    </div>
  )
}

function ListView({ events }: { events: EventRecord[] }) {
  return (
    <div className="overflow-auto rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Title</th>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Organizer</th>
            <th className="px-4 py-2 text-left font-medium">Edit</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {events.map(e => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{e.title}</td>
              <td className="px-4 py-2">
                {new Date(e.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 capitalize">{e.status}</td>
              <td className="px-4 py-2">{e.organizer}</td>
              <td className="px-4 py-2">
                <Link href={`/admin/events/${e.id}/edit`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CompactView({ events }: { events: EventRecord[] }) {
  return (
    <ul className="space-y-2">
      {events.map(e => (
        <li
          key={e.id}
          className="flex items-center justify-between bg-white rounded-lg p-3 shadow hover:bg-gray-50 transition"
        >
          <div className="flex-1">
            <p className="font-medium truncate">{e.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(e.date).toLocaleDateString()}
            </p>
          </div>
          <Link href={`/admin/events/${e.id}/edit`} className="text-blue-600 hover:underline text-sm">
            Edit
          </Link>
        </li>
      ))}
      {events.length === 0 && (
        <li className="text-center py-6 text-gray-500">No events found.</li>
      )}
    </ul>
  )
}
