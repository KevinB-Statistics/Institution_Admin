// File: src/app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { listAllEvents, createEvent } from '@/lib/adminApi'

/**
 * API handler for `/api/events`.
 *
 * This route supports two HTTP methods:
 *  - GET  – return the full list of events as JSON.
 *  - POST – create a new event from the JSON body and return it.
 *
 * The functions used here delegate to the file‑based persistence layer in
 * `src/lib/adminApi.ts`. If the data directory or JSON file does not
 * exist it will be created automatically.
 */

// Handle GET requests: return all events
export async function GET(_: NextRequest) {
  try {
    const events = await listAllEvents()
    return NextResponse.json(events)
  } catch (err) {
    console.error('Failed to list events:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// Handle POST requests: create a new event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Construct a proper event payload. Many fields are optional in
    // EventRecord, but a few (date, status, organizer, title, description)
    // are required. If they are missing from the request body we assign
    // sensible defaults. The date defaults to today or the start date,
    // status defaults to 'pending', and organizer defaults to 'Unknown'.
    const today = new Date().toISOString().slice(0, 10)
    const payload = {
      title: data.title,
      description: data.description,
      date: data.date ?? (data.start ? data.start.slice(0, 10) : today),
      status: data.status ?? 'pending',
      organizer: data.organizer ?? 'Unknown',
      category: data.category,
      tags: data.tags,
      visibility: data.visibility,
      selectedClub: data.selectedClub,
      selectedGroup: data.selectedGroup,
      location: data.location,
      start: data.start,
      end: data.end,
      rrule: data.rrule,
      timezone: data.timezone,
    }
    const newEvent = await createEvent(payload as any)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create event:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}