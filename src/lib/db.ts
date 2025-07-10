// File: src/lib/db.ts

// === Replace this with your actual DB client init ===
// e.g. import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient();

interface EventRecord {
  id: number
  title: string
  date: string
  approved: boolean
}

// Stub data for now
const _mockEvents: EventRecord[] = [
  { id: 1, title: 'Welcome Week',      date: '2025-08-25', approved: true  },
  { id: 2, title: 'Fall Club Fair',    date: '2025-09-05', approved: true  },
  { id: 3, title: 'Spring Break Bash', date: '2025-03-12', approved: false },
  // …etc.
]

/**
 * Total number of events (approved or not).
 */
export async function getTotalEvents(): Promise<number> {
  // TODO: replace with real DB count
  return _mockEvents.length
}

/**
 * Number of upcoming events (date ≥ today).
 */
export async function getUpcomingEvents(): Promise<number> {
  const today = new Date().toISOString().slice(0,10)
  return _mockEvents.filter(e => e.date >= today).length
}

/**
 * Number of events pending approval.
 */
export async function getPendingApprovals(): Promise<number> {
  return _mockEvents.filter(e => !e.approved).length
}
