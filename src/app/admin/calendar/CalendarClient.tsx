"use client";

import { useState } from "react";
import {
  addDays,
  addMonths,
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { EventRecord } from "@/lib/types";
import CalendarView from "@/components/Calendar/CalendarView";
import MiniMonthView from "@/components/Calendar/MiniMonthView";
import CategoryList from "@/components/Calendar/CategoryList";
import {
  Calendar as CalendarIcon,
  List as ListIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Plus as PlusIcon,
} from "lucide-react";

/**
 * CalendarClient is the top-level client component for the calendar page.
 * It wraps the calendar view with a dashboard-like layout inspired by modern
 * calendar dashboards. The component provides a search field, view toggles,
 * range navigation, a mini month calendar and a category list in a sidebar.
 */
export default function CalendarClient({ events }: { events: EventRecord[] }) {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [current, setCurrent] = useState(new Date());
  // Track the month displayed in the mini calendar.
  const [miniMonth, setMiniMonth] = useState(new Date());
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const VIEWS: ("day" | "week" | "month")[] = ["day", "week", "month"];

  const changeRange = (dir: number) => {
    if (view === "day") setCurrent((prev) => addDays(prev, dir));
    else if (view === "week") setCurrent((prev) => addDays(prev, dir * 7));
    else setCurrent((prev) => addMonths(prev, dir));
  };

  const zones = Intl.supportedValuesOf
    ? Intl.supportedValuesOf("timeZone")
    : [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
      ];

  // Format the header label based on the current view.
  const label =
    view === "day"
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "full",
          timeZone,
        }).format(current)
      : view === "week"
      ? `${new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          timeZone,
        }).format(startOfWeek(current, { weekStartsOn: 1 }))} - ${new Intl.DateTimeFormat(
          undefined,
          { month: "short", day: "numeric", year: "numeric", timeZone }
        ).format(endOfWeek(current, { weekStartsOn: 1 }))}`
      : new Intl.DateTimeFormat(undefined, {
          month: "long",
          year: "numeric",
          timeZone,
        }).format(current);

  // Filter events based on the current view.
  let filtered = events;
  if (view === "day") {
    filtered = events.filter((e) => isSameDay(new Date(e.start as string), current));
  } else if (view === "week") {
    const start = startOfWeek(current, { weekStartsOn: 1 });
    const end = endOfWeek(current, { weekStartsOn: 1 });
    filtered = events.filter((e) => {
      const d = new Date(e.start as string);
      return d >= start && d <= end;
    });
  } else if (view === "month") {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    filtered = events.filter((e) => {
      const d = new Date(e.start as string);
      return d >= start && d <= end;
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top header with search, view toggles, navigation and actions */}
      <div className="mb-4 flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
        {/* Search input */}
        <input
          type="search"
          placeholder="Search for anything"
          className="flex-1 rounded border px-3 py-2 text-sm placeholder-gray-400"
        />
        {/* View toggles */}
        <div className="inline-flex overflow-hidden rounded border bg-white">
          {VIEWS.map((v) => (
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
        {/* Today and range navigation */}
        <button
          type="button"
          onClick={() => setCurrent(new Date())}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Today
        </button>
        <div className="flex border rounded overflow-hidden">
          <button
            type="button"
            onClick={() => changeRange(-1)}
            className="px-3 py-2 text-sm hover:bg-gray-50"
            aria-label="Previous"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => changeRange(1)}
            className="px-3 py-2 text-sm border-l hover:bg-gray-50"
            aria-label="Next"
          >
            &gt;
          </button>
        </div>
        {/* Label showing the current range */}
        <span className="text-sm font-medium">{label}</span>
        {/* Time zone selector */}
        <select
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          className="rounded border px-2 py-2 text-sm"
        >
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        {/* Add event button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Event
        </button>
      </div>
      {/* Main layout: vertical nav, sidebar, and calendar view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical navigation icons */}
        <div className="hidden sm:flex flex-col items-center space-y-6 py-4 px-2 border-r bg-gray-50">
          <CalendarIcon className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
          <ListIcon className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
          <UsersIcon className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
          <SettingsIcon className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
        </div>
        {/* Sidebar with mini calendar and categories */}
        <div className="w-64 hidden md:block border-r bg-white p-4 overflow-y-auto">
          <MiniMonthView
            date={miniMonth}
            selected={current}
            onMonthChange={(d) => setMiniMonth(d)}
            onSelect={(d) => setCurrent(d)}
          />
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">My Calendars</h3>
            <CategoryList
              items={[
                { label: "Social", color: "#38bdf8" },
                { label: "Academic", color: "#818cf8" },
                { label: "Sports", color: "#34d399" },
                { label: "Cultural", color: "#fbbf24" },
              ]}
            />
          </div>
        </div>
        {/* Main calendar view */}
        <div className="flex-1 overflow-auto bg-white p-2">
          <CalendarView view={view} events={filtered} date={current} timeZone={timeZone} />
        </div>
      </div>
    </div>
  );
}