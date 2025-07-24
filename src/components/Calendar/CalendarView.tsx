"use client"

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
  status?: string;
}

export interface CalendarViewProps {
  events: EventRecord[];
  view: 'day' | 'week' | 'month';
  date: Date;
  timeZone: string;
  onSelectEvent?: (id: string) => void;
}

export default function CalendarView({ events, view, date, timeZone, onSelectEvent }: CalendarViewProps) {
  const normalized: Event[] = events
    .filter(e => e.start && e.end)
    .map(e => ({
      id: e.id,
      title: e.title,
      start: e.start as string,
      end: e.end as string,
      category: e.category,
      status: e.status,
    }));

  switch (view) {
    case 'day':
      return <DayView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
    case 'week':
      return <WeekView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
    default:
      return <MonthView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
  }
}