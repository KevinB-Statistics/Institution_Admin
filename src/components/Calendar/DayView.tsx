"use client"

import React, { useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';
import { Event } from './CalendarView';
import { computeDayPositions, type DayPosition } from './OverlapUtils';


export interface DayViewProps {
  events: Event[];          // All events for the current day
  onSelectEvent?: (id: string) => void;
}

const CELL_HEIGHT = 48; // px per hour
const CATEGORY_COLORS: Record<string, string> = {
  Social: '#38bdf8',
  Academic: '#818cf8',
  Sports: '#34d399',
  Cultural: '#fbbf24',
  Default: '#3b82f6',
};

export default function DayView({ events, onSelectEvent }: DayViewProps) {
  // Compute overlapping columns for the day events
  const positioned = useMemo<DayPosition[]>(
    () => computeDayPositions(events),
    [events]
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Hour labels */}
      <div className="w-12 flex flex-col border-r border-gray-200">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="h-48 flex items-start justify-end pr-1 text-xs text-gray-500"
          >
            {i}:00
          </div>
        ))}
      </div>

      {/* Events container */}
      <div className="relative flex-1 overflow-auto">
        {/* Half-hour grid lines */}
        <div className="absolute inset-0 grid grid-rows-[repeat(48,minmax(0,1fr))] w-full">
          {Array.from({ length: 48 }).map((_, idx) => (
            <div
              key={idx}
              className={idx % 2 === 0 ? 'border-t border-gray-200' : 'border-t border-gray-100'}
            />
          ))}
        </div>

        {/* Event blocks */}
        {positioned.map(({ event, col, cols }) => {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);
          const minutesFromMid = startDate.getHours() * 60 + startDate.getMinutes();
          const durationMin = differenceInMinutes(endDate, startDate);
          const widthPct = 100 / cols;
          const leftPct = col * widthPct;
          const bg = CATEGORY_COLORS[event.category || 'Default'];

          return (
            <div
              key={event.id}
              className="absolute rounded text-white text-xs p-1 overflow-hidden cursor-pointer"
              style={{
                top: (minutesFromMid / 60) * CELL_HEIGHT,
                height: (durationMin / 60) * CELL_HEIGHT,
                left: `${leftPct}%`,
                width: `calc(${widthPct}% - 4px)`,
                backgroundColor: bg,
              }}
              onClick={() => onSelectEvent?.(event.id)}
              title={`${event.title} (${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, '0')} - ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2, '0')})`}
            >
              {event.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
