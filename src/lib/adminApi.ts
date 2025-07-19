import { promises as fs } from 'fs'
import path from 'path'
import type { EventRecord } from './types'

/**
 * Path to the local JSON database file. The file is stored alongside this
 * module and contains an array of event objects. For a real application you
 * would likely store this in a data directory or use a proper database, but
 * this simple file‑based approach lets you persist events without a back‑end.
 */
const DB_PATH = path.join(process.cwd(), 'events.json')



/**
 * Read all events from the JSON database. If the file does not exist or
 * contains invalid JSON, an empty array is returned.
 */
async function readEvents(): Promise<EventRecord[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(data) as EventRecord[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    console.error('Failed to read events:', err)
    return []
  }
}

/**
 * Write an array of events back to the JSON database file.
 */
async function writeEvents(events: EventRecord[]): Promise<void> {
  const data = JSON.stringify(events, null, 2)
  await fs.writeFile(DB_PATH, data, 'utf8')
}

/**
 * List all events. This function reads from the local JSON file each time
 * to ensure fresh data.
 */
export async function listAllEvents(): Promise<EventRecord[]> {
  return await readEvents()
}

/**
 * List pending events only.
 */
export async function listPendingEvents(): Promise<EventRecord[]> {
  const events = await readEvents()
  return events.filter((e) => e.status === 'pending')
}

/**
 * List template events only.
 */
export async function listTemplateEvents(): Promise<EventRecord[]> {
  const events = await readEvents()
  return events.filter((e) => e.status === 'template')
}

/**
 * Create a new event and persist it to the JSON database. The caller must
 * provide an object with at least title, date, status, organizer, and
 * description. The function assigns a new unique id automatically. It
 * returns the newly created event record.
 */
export async function createEvent(event: Omit<EventRecord, 'id'>): Promise<EventRecord> {
  const events = await readEvents()
  const newId = (Date.now()).toString()
  const newEvent: EventRecord = { id: newId, ...event }
  events.push(newEvent)
  await writeEvents(events)
  return newEvent

}
export async function getEvent(id: string): Promise<EventRecord | undefined> {
  const events = await readEvents()
  return events.find(e => e.id === id)
}

export async function updateEvent(id: string, data: Partial<EventRecord>): Promise<EventRecord | null> {
  const events = await readEvents()
  const index = events.findIndex(e => e.id === id)
  if (index === -1) return null
  events[index] = { ...events[index], ...data, id }
  await writeEvents(events)
  return events[index]
}

export async function deleteEvent(id: string): Promise<boolean> {
  const events = await readEvents()
  const index = events.findIndex(e => e.id === id)
  if (index === -1) return false
  events.splice(index, 1)
  await writeEvents(events)
  return true
}
