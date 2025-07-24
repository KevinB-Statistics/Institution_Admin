"use client";

import React from "react";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * MiniMonthView renders a compact monthly calendar similar to the sidebar
 * calendar in many dashboard designs. It shows the current month with
 * navigation controls and allows the user to select a date. The selected
 * date is highlighted and clicking on a day will call the onChange handler.
 *
 * Props:
 * - date: The month and year currently displayed in the mini calendar.
 * - selected: The currently selected date.
 * - onMonthChange: Callback fired when the month changes via prev/next.
 * - onSelect: Callback fired when a date is selected.
 */
export interface MiniMonthViewProps {
  date: Date;
  selected: Date;
  onMonthChange?: (date: Date) => void;
  onSelect?: (date: Date) => void;
}

const WEEKDAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MiniMonthView({
  date,
  selected,
  onMonthChange,
  onSelect,
}: MiniMonthViewProps) {
  // Compute the start and end dates needed to render a 6-row calendar grid.
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate an array of all days to display.
  const days: Date[] = [];
  for (let d = calendarStart; d <= calendarEnd; d = addDays(d, 1)) {
    days.push(d);
  }

  // Change the displayed month by adding/subtracting one month.
  const handlePrevMonth = () => {
    if (onMonthChange) {
      onMonthChange(addMonths(date, -1));
    }
  };
  const handleNextMonth = () => {
    if (onMonthChange) {
      onMonthChange(addMonths(date, 1));
    }
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-gray-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-medium">
          {format(date, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-gray-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d[0]}</div>
        ))}
      </div>
      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const inCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());
          // Base styles for each day number.
          let className =
            "text-xs h-6 w-6 flex items-center justify-center rounded-full";
          className += inCurrentMonth ? " text-gray-700" : " text-gray-400";
          if (isSelected) {
            // When the day is currently selected fill it with the primary colour and
            // invert the text.  This creates a clear focal point in the mini
            // calendar.
            className += " bg-blue-600 text-white";
          } else if (isToday) {
            // Highlight today with a subtle border instead of a solid fill to
            // maintain a light, airy feel.  The text colour is tinted blue to
            // differentiate it from other dates without drawing too much
            // attention.
            className += " border border-blue-600 text-blue-600";
          }
          return (
            <div key={idx} className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => onSelect?.(day)}
                className={className}
              >
                {format(day, "d")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}