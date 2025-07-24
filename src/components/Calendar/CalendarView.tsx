import React from 'react';
import type { EventRecord } from '@/lib/types';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  category?: string;
}

export interface CalendarViewProps {
  events: EventRecord[];
  view: 'day' | 'week' | 'month';
  onSelectEvent?: (id: string) => void;
}

export default function CalendarView({ events, view, onSelectEvent }: CalendarViewProps) {
  const normalized: Event[] = events
    .filter(e => e.start && e.end)
    .map(e => ({
      id: e.id,
      title: e.title,
      start: e.start as string,
      end: e.end as string,
      category: e.category,
    }));

  switch (view) {
    case 'day':
      return <DayView events={normalized} onSelectEvent={onSelectEvent} />;
    case 'week':
      return <WeekView events={normalized} onSelectEvent={onSelectEvent} />;
    default:
      return <MonthView events={normalized} onSelectEvent={onSelectEvent} />;
  }
}