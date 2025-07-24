"use client"

import React from 'react';
import type { EventRecord } from '@/lib/types';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
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
  const localized: Event[] = events
    .filter(e => e.start && e.end)
    .map(e => {
      const startUtc = fromZonedTime(e.start as string, e.timezone || timeZone);
      const endUtc = fromZonedTime(e.end as string, e.timezone || timeZone);
      const start = toZonedTime(startUtc, timeZone).toISOString();
      const end = toZonedTime(endUtc, timeZone).toISOString();
      return {
        id: e.id,
        title: e.title,
        start,
        end,
        category: e.category,
        status: e.status,
      };
    });

  switch (view) {
    case 'day': {
      const startDay = startOfDay(date);
      const endDay = endOfDay(date);
      const viewEvents = localized.filter(ev => {
        const s = new Date(ev.start);
        return s >= startDay && s <= endDay;
      });
      return <DayView events={viewEvents} date={date} timezone={timeZone} onSelectEvent={onSelectEvent} />;
    }
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      const viewEvents = localized.filter(ev => {
        const s = new Date(ev.start);
        return s >= weekStart && s <= weekEnd;
      });
      return <WeekView events={viewEvents} startDate={weekStart} timezone={timeZone} onSelectEvent={onSelectEvent} />;
    }
    default: {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const viewEvents = localized.filter(ev => {
        const s = new Date(ev.start);
        return s >= monthStart && s <= monthEnd;
      });
      return <MonthView events={viewEvents} month={monthStart} timezone={timeZone} onSelectEvent={onSelectEvent} />;
    }
  }
}