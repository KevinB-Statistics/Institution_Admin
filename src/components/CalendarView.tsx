// File: src/components/CalendarView.tsx
"use client";
import type { JSX } from "react";

import React, { useState, useMemo, Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventRecord } from "@/lib/adminApi";

type View = "week" | "month" | "year";

export default function CalendarView({ events }: { events: EventRecord[] }) {
  const [view, setView] = useState<View>("month");
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(
    () =>
      events.reduce<Record<string, EventRecord[]>>((acc, ev) => {
        acc[ev.date] = acc[ev.date] ? [...acc[ev.date], ev] : [ev];
        return acc;
      }, {}),
    [events]
  );
  const eventsByMonth = useMemo(() => {
    return events.reduce<Record<string, number>>((acc, ev) => {
      const d = new Date(ev.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [events])

  const formatMonthYear = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const move = (delta: number) => {
    const next = new Date(current);
    if (view === "month") next.setMonth(next.getMonth() + delta);
    if (view === "week") next.setDate(next.getDate() + delta * 7);
    if (view === "year") next.setFullYear(next.getFullYear() + delta);
    setCurrent(next);
    setSelectedDate(null);
  };

  const startOfWeek = (d: Date) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
    return copy;
  };

  const renderSidebar = () => {
    if (!selectedDate) return null
    const dayEvents = eventsByDate[selectedDate] ?? []
    return (
      <aside className="w-64 h-full bg-white border-l p-4 overflow-auto">
        <header className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-base">
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </header>
        <ul className="space-y-2 text-sm">
          {dayEvents.map(e => (
            <li key={e.id} className="p-2 border-b">
              <h4 className="font-medium">{e.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{e.description}</p>
            </li>
          ))}
        </ul>
      </aside>
    )
  }

  const renderWeek = () => {
    const start = startOfWeek(current);
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });

    return (
      <div className="flex-1 flex">
        <div className="flex-1 overflow-auto bg-white shadow-sm rounded">
          <div className="grid grid-cols-8 sticky top-0 bg-white z-10 border-b">
            <div className="h-8" />
            {days.map((day) => (
              <div key={day.toISOString()} className="py-1 text-center font-medium text-sm">
                {day.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
              </div>
              ))}
          </div>
          <div className="grid grid-cols-8">
            {hours.map((hour) => (
              <Fragment key={hour}>
                <div className="py-1 px-1 text-xs text-gray-500 border-r">
                  {`${hour.toString().padStart(2, "0")}:00`}
                </div>
                {days.map((day) => {
                  const key = day.toISOString().slice(0, 10);
                  const evs = eventsByDate[key] ?? [];
                  return (
                    <div
                      key={`${key}-${hour}`}
                      className="h-12 border-b border-r hover:bg-gray-50 p-0.5"
                    >
                      {hour === 0 && (
                        <ul className="text-xxs space-y-1">
                          {evs.map((e) => (
                            <li
                              key={e.id}
                              className="truncate cursor-pointer hover:underline"
                              onClick={() => setSelectedDate(key)}
                            >
                              • {e.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
        {renderSidebar()}
      </div>
    );
  };

  const renderMonth = () => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const weeks: JSX.Element[] = [];
    let dayCounter = 1 - startDay;

    for (let w = 0; w < 6; w++) {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(year, month, dayCounter++);
        const iso = d.toISOString().slice(0, 10);
        const inMonth = d.getMonth() === month;
        return (
          <button
            key={`${w}-${i}`}
            onClick={() => inMonth && setSelectedDate(iso)}
            className={
              `flex flex-col p-1 gap-1 text-left transition-colors duration-150
               ${inMonth ? 'hover:bg-gray-100 bg-white' : 'bg-gray-50 text-gray-400'}
               ${selectedDate === iso ? 'ring-2 ring-blue-500' : ''}`
            }
          >
            <span className="text-xs font-semibold">{d.getDate()}</span>
            {(eventsByDate[iso] ?? []).map(e => (
              <span key={e.id} className="text-xxs truncate">• {e.title}</span>
            ))}
          </button>
        );
      });
      weeks.push(
        <div key={w} className="grid grid-cols-7 gap-px flex-1">
          {days}
        </div>
      );
    }

    return (
      <div className="flex-1 flex h-full">
        <div className="flex-1 flex flex-col h-full">
          <div className="grid grid-cols-7 text-xs font-medium text-gray-600 border-b">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="py-2 text-center">{d}</div>
            ))}
          </div>
           <div className="flex-1 overflow-auto grid grid-rows-6 gap-px">
            {weeks}
          </div>
        </div>
        {renderSidebar()}
      </div>
    );
  };

  const renderYear = () => {
    const year = current.getFullYear();
    return (
      <div role="grid" aria-label="Year view" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {Array.from({ length: 12 }, (_, m) => {
          const date = new Date(year, m, 1);
          const count = eventsByMonth[`${year}-${m}`] ?? 0;
          return (
            <article
              key={m}
              onClick={() => {
                setCurrent(date);
                setView('month');
              }}
              className="cursor-pointer flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:shadow-sm text-sm aspect-square"
            >
              <header className="font-semibold">{date.toLocaleDateString(undefined, { month: 'short' })}</header>
              <span className="text-gray-500">{count} events</span>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <section className="flex flex-col h-full flex-1 bg-gray-100">
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => move(-1)} aria-label="Previous" className="p-2 rounded-full bg-gray-50 hover:bg-gray-200">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold">{view === 'year' ? current.getFullYear() : formatMonthYear(current)}</h2>
          <button onClick={() => move(1)} aria-label="Next" className="p-2 rounded-full bg-gray-50 hover:bg-gray-200">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <nav className="flex items-center gap-2">
          {(['week','month','year'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${view === v ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {view === 'week' && renderWeek()}
        {view === 'month' && renderMonth()}
        {view === 'year' && renderYear()}
      </div>
    </section>
  );
}


