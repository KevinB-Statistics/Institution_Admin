import { Event } from './CalendarView';

/**
 * Represents an event positioned in a day grid with overlap columns.
 */
export interface DayPosition {
  event: Event;
  /** Zero-based column index */
  col: number;
  /** Total number of columns in this overlapping group */
  cols: number;
}

/**
 * Compute side-by-side column positions for events that overlap in time.
 *
 * @param events - Array of events with ISO start/end strings
 * @returns Array of DayPosition entries indicating column and span
 */
export function computeDayPositions(events: Event[]): DayPosition[] {
  // Map to hold sorted events
  const sorted = events
    .map(e => ({ e, start: new Date(e.start).getTime(), end: new Date(e.end).getTime() }))
    .sort((a, b) => a.start - b.start);

  // Groups of overlapping events
  const groups: Event[][] = [];

  sorted.forEach(({ e, start, end }) => {
    let placed = false;
    for (const grp of groups) {
      // Check if this event does NOT overlap any in group
      const overlap = grp.some(g => {
        const gs = new Date(g.start).getTime();
        const ge = new Date(g.end).getTime();
        return gs < end && ge > start;
      });
      if (!overlap) {
        grp.push(e);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([e]);
    }
  });

  // Assign column index within each group
  const positions: DayPosition[] = [];
  groups.forEach(grp => {
    grp.forEach((e, idx) => positions.push({ event: e, col: idx, cols: grp.length }));
  });

  return positions;
}

/**
 * Represents an event positioned in a week grid with overlap columns and day index.
 */
export interface WeekPosition extends DayPosition {
  /** Weekday index (0=Monday .. 6=Sunday) */
  day: number;
}

/**
 * Compute positions for a week's worth of events, grouping by weekday,
 * then computing overlapping columns per day.
 *
 * @param events - Array of events with ISO start/end strings
 * @returns Array of WeekPosition entries with day, column, and span
 */
export function computeWeekPositions(events: Event[]): WeekPosition[] {
  // Group events by weekday (Mon=0..Sun=6)
  const byDay: Record<number, Event[]> = {};
  events.forEach(e => {
    const start = new Date(e.start);
    const day = (start.getDay() + 6) % 7;
    byDay[day] = byDay[day] || [];
    byDay[day].push(e);
  });

  // Compute positions for each day and tag with day index
  const weekPositions: WeekPosition[] = [];
  Object.entries(byDay).forEach(([dayStr, evs]) => {
    const day = parseInt(dayStr, 10);
    const dayPositions = computeDayPositions(evs);
    dayPositions.forEach(dp => {
      weekPositions.push({ ...dp, day });
    });
  });

  return weekPositions;
}
