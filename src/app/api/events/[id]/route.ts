// File: src/app/api/events/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getEvent, updateEvent, deleteEvent } from '@/lib/adminApi'

/**
 * API handler for `/api/events/:id`.
 *
 * Supports the following HTTP methods:
 *  - GET    – return the event with the specified ID or 404 if not found.
 *  - PUT    – update the event with the specified ID using the JSON body.
 *  - DELETE – remove the event with the specified ID. Returns 204 on success.
 */

// Return a single event by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) {
    return new NextResponse('Event not found', { status: 404 })
  }
  return NextResponse.json(event)
}

// Update an event by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json()
    const { id } = await params
    const updated = await updateEvent(id, data as any)
    if (!updated) {
      return new NextResponse('Event not found', { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('Failed to update event:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}

// Delete an event by ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = await deleteEvent(id)
  if (!ok) {
    return new NextResponse('Event not found', { status: 404 })
  }
  // 204 No Content indicates successful deletion with no body
  return new NextResponse(null, { status: 204 })
}