import { Metadata } from 'next';
import { listAllEvents } from '@/lib/adminApi';
import type { EventRecord } from '@/lib/types';
import CalendarView from '@/components/Calendar/CalendarView';

export const metadata: Metadata = {
  title: 'Calendar – Institution Admin',
};

export default async function CalendarPage() {
  // Fetch all events on the server
  const events: EventRecord[] = await listAllEvents();

  // Render the client-side CalendarView with a default week view
  return <CalendarView view="week" events={events} />;
}
