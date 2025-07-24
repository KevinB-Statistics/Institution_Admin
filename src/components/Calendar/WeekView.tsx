"use client"

import React, { useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';
import { Event } from './CalendarView';
import { computeWeekPositions, type WeekPosition } from './OverlapUtils';

const CATEGORY_COLORS: Record<string, string> = {
  Social: '#38bdf8',
  Academic: '#818cf8',
  Sports: '#34d399',
  Cultural: '#fbbf24',
  Default: '#3b82f6',
};

export interface WeekViewProps {
  events: Event[];
  onSelectEvent?: (id: string) => void;
}

const CELL_HEIGHT = 48; // pixels per hour

export default function WeekView({ events, onSelectEvent }: WeekViewProps) {
  const now = new Date();

  const positioned = useMemo<WeekPosition[]>(
    () => computeWeekPositions(events),
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

      {/* Days grid and events */}
      <div className="relative flex-1 grid grid-cols-7 border-l border-gray-200">
        {/* Half-hour grid lines */}
        <div className="absolute inset-0 grid grid-rows-[repeat(48,minmax(0,1fr))] w-full">
          {Array.from({ length: 48 }).map((_, idx) => (
            <div
              key={idx}
              className={idx % 2 === 0 ? 'border-t border-gray-200' : 'border-t border-gray-100'}
            />
          ))}
        </div>

        {/* Day columns */}
        {Array.from({ length: 7 }).map((_, dayIdx) => (
          <div key={dayIdx} className="col-span-1 border-r border-gray-200" />
        ))}

        {/* Current time indicator */}
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].includes(now.toDateString().slice(0,3)) && (
          <div
            className="absolute h-px bg-red-500 w-full"
            style={{ top: (now.getHours() + now.getMinutes() / 60) * CELL_HEIGHT }}
          />
        )}

        {/* Event blocks */}
        {positioned.map(({ event, day, col, cols }) => {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);
          const minutesFromMid = startDate.getHours() * 60 + startDate.getMinutes();
          const durationMin = differenceInMinutes(endDate, startDate);
          const baseLeft = (day / 7) * 100;
          const widthPct = 100 / 7 / cols;
          const leftPct = baseLeft + col * widthPct;
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
              title={`${event.title} (${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2,'0')} - ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2,'0')})`}
            >
              {event.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
