"use client"

import React, { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Event } from './CalendarView';

export interface MonthViewProps {
  events: Event[];
  date: Date;
  timeZone: string;
  onSelectEvent?: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Social: '#38bdf8',
  Academic: '#818cf8',
  Sports: '#34d399',
  Cultural: '#fbbf24',
  Default: '#3b82f6',
};

export default function MonthView({ events, date, timeZone, onSelectEvent }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate all dates to render in the grid
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let curr = calendarStart;
    while (curr <= calendarEnd) {
      days.push(curr);
      curr = addDays(curr, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  // Map events by date string (YYYY-MM-DD)
  const eventsMap = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((e) => {
      const key = formatInTimeZone(new Date(e.start), timeZone, 'yyyy-MM-dd');
      const list = map.get(key) || [];
      list.push(e);
      map.set(key, list);
    });
    return map;
  }, [events]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Weekday headers */}
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="py-1 text-center text-xs font-semibold text-gray-600">
          {d}
        </div>
      ))}

      {/* Date cells */}
      {calendarDays.map((day) => {
        const dayKey = formatInTimeZone(day, timeZone, 'yyyy-MM-dd');
        const dayEvents = eventsMap.get(dayKey) || [];
        const inMonth = isSameMonth(day, monthStart);

        return (
          <div
            key={dayKey}
            className={`h-24 border border-gray-200 p-1 relative ${
              inMonth ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            {/* Day number */}
            <div className="absolute top-1 right-1 text-xs text-gray-500">
              {formatInTimeZone(day, timeZone, 'd')}
            </div>

            {/* Events list (up to 3) */}
            <div className="mt-4 space-y-0.5 overflow-hidden">
              {dayEvents.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className={`flex items-center text-xs truncate cursor-pointer ${ev.status !== 'approved' ? 'opacity-60' : ''}`}
                  onClick={() => onSelectEvent?.(ev.id)}
                  title={`${ev.title} (${formatInTimeZone(new Date(ev.start), timeZone, 'HH:mm')} - ${formatInTimeZone(
                    new Date(ev.end),
                    timeZone,
                    'HH:mm'
                  )})`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1 flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[ev.category || 'Default'], opacity: ev.status !== 'approved' ? 0.6 : 1 }}
                  />
                  <span className="truncate">{ev.title}</span>
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
