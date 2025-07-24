import React, { ReactNode } from 'react';

export interface TimeGridProps {
  /** Pixel height per hour row */
  cellHeight?: number;
  /** Starting hour (inclusive) */
  startHour?: number;
  /** Ending hour (exclusive) */
  endHour?: number;
  /** Event blocks or other overlays to render on top */
  children: ReactNode;
}

export default function TimeGrid({
  cellHeight = 48,
  startHour = 0,
  endHour = 24,
  children,
}: TimeGridProps) {
  const hoursCount = endHour - startHour;
  const halfHourRows = hoursCount * 2;
  const hours = Array.from({ length: hoursCount }, (_, i) => startHour + i);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Hour labels */}
      <div className="w-12 flex flex-col border-r border-gray-200">
        {hours.map((h) => (
          <div
            key={h}
            className="flex items-start justify-end pr-1 text-xs text-gray-500"
            style={{ height: cellHeight }}
          >
            {h}:00
          </div>
        ))}
      </div>

      {/* Grid and overlays */}
      <div className="relative flex-1 overflow-auto">
        {/* Half-hour grid lines */}
        <div
          className="absolute inset-0 w-full"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${halfHourRows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: halfHourRows }).map((_, idx) => (
            <div
              key={idx}
              className={idx % 2 === 0 ? 'border-t border-gray-200' : 'border-t border-gray-100'}
            />
          ))}
        </div>

        {/* Child overlays (events, indicator, etc.) */}
        {children}
      </div>
    </div>
  );
}
