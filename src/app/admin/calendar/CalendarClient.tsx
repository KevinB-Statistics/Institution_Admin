"use client";

import { useState } from "react";
import { addDays, addMonths, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import type { EventRecord } from "@/lib/types";
import CalendarView from "@/components/Calendar/CalendarView";

export default function CalendarClient({ events }: { events: EventRecord[] }) {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [current, setCurrent] = useState(new Date());
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const VIEWS: ("day" | "week" | "month")[] = ["day", "week", "month"];

  const changeRange = (dir: number) => {
    if (view === "day") setCurrent(prev => addDays(prev, dir));
    else if (view === "week") setCurrent(prev => addDays(prev, dir * 7));
    else setCurrent(prev => addMonths(prev, dir));
  };

  const zones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
  ];

  const label = view === "day"
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeZone }).format(current)
    : view === "week"
    ? `${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone }).format(startOfWeek(current, { weekStartsOn: 1 }))} - ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", timeZone }).format(endOfWeek(current, { weekStartsOn: 1 }))}`
    : new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone }).format(current);

  let filtered = events;
  if (view === "day") {
    filtered = events.filter(e => isSameDay(new Date(e.start as string), current));
  } else if (view === "week") {
    const start = startOfWeek(current, { weekStartsOn: 1 });
    const end = endOfWeek(current, { weekStartsOn: 1 });
    filtered = events.filter(e => {
      const d = new Date(e.start as string);
      return d >= start && d <= end;
    });
  } else if (view === "month") {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    filtered = events.filter(e => {
      const d = new Date(e.start as string);
      return d >= start && d <= end;
    });
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex overflow-hidden rounded-full border bg-white">
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-medium capitalize transition ${
              view === v
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => changeRange(-1)}
          className="rounded border px-2 py-1 text-sm"
        >
          &lt;
        </button>
        <button
          onClick={() => changeRange(1)}
          className="rounded border px-2 py-1 text-sm"
        >
          &gt;
        </button>
        <span className="text-sm font-semibold">{label}</span>
        <select
          value={timeZone}
          onChange={e => setTimeZone(e.target.value)}
          className="ml-auto rounded border px-2 py-1 text-sm"
        >
          {zones.map(z => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        <CalendarView view={view} events={filtered} date={current} timeZone={timeZone} />
      </div>
    </div>
  );
}