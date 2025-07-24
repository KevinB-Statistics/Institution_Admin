"use client";

import { useState, useMemo } from "react";
import type { EventRecord } from "@/lib/types";
import CalendarView from "@/components/Calendar/CalendarView";
import { addDays, addWeeks, addMonths, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export default function CalendarClient({ events }: { events: EventRecord[] }) {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const VIEWS: ("day" | "week" | "month")[] = ["day", "week", "month"];

  const header = useMemo(() => {
    switch (view) {
      case "day":
        return formatInTimeZone(currentDate, timeZone, "EEEE, MMMM d, yyyy");
      case "week": {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = addDays(start, 6);
        return `${formatInTimeZone(start, timeZone, "MMM d")} - ${formatInTimeZone(end, timeZone, "MMM d, yyyy")}`;
      }
      default:
        return formatInTimeZone(currentDate, timeZone, "MMMM yyyy");
    }
  }, [view, currentDate, timeZone]);

  const navigate = (dir: -1 | 1) => {
    setCurrentDate((d) => {
      switch (view) {
        case "day":
          return addDays(d, dir);
        case "week":
          return addWeeks(d, dir);
        default:
          return addMonths(d, dir);
      }
    });
  };

  const tzOptions = useMemo(() => Intl.supportedValuesOf("timeZone"), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex overflow-hidden rounded-full border bg-white">
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded border px-2 py-1 text-sm bg-white hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="font-semibold">{header}</span>
          <button
            onClick={() => navigate(1)}
            className="rounded border px-2 py-1 text-sm bg-white hover:bg-gray-50"
          >
            Next
          </button>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="ml-2 rounded border px-2 py-1 text-sm"
          >
            {tzOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[calc(100vh-16rem)]">
        <CalendarView view={view} events={events} date={currentDate} timeZone={timeZone} />
      </div>
    </div>
  );
}
