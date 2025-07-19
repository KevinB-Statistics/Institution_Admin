// File: src/lib/db.ts

// This module provides simple summary helpers for the admin dashboard.
// In the initial prototype of this project, these helpers returned
// hard‑coded counts from a `_mockEvents` array. However, that approach
// prevented the rest of the application from reflecting changes made via
// the event creation and editing interfaces. To ensure that the dashboard
// stays in sync with the persisted data, these helpers now read from the
// same JSON file used elsewhere in the app. See `src/lib/adminApi.ts` for
// the file‑based persistence implementation.

import { listAllEvents } from './adminApi'

/**
 * Return the total number of events (regardless of status).
 *
 * This function reads the events JSON on each invocation to ensure
 * that the result reflects the latest state. In a real application
 * backed by a database you would issue a count query instead.
 */
export async function getTotalEvents(): Promise<number> {
  const events = await listAllEvents()
  return events.length
}

/**
 * Return the number of upcoming events. An event is considered
 * upcoming if its `date` field is on or after today's date.
 */
export async function getUpcomingEvents(): Promise<number> {
  const events = await listAllEvents()
  const today = new Date().toISOString().slice(0, 10)
  return events.filter(e => e.date >= today).length
}

/**
 * Return the number of events pending approval. Pending events are
 * those whose `status` field is equal to `'pending'`.
 */
export async function getPendingApprovals(): Promise<number> {
  const events = await listAllEvents()
  return events.filter(e => e.status === 'pending').length
}