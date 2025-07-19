import { NextResponse } from 'next/server'
import { listAllEvents, createEvent } from '@/lib/adminApi'
// GET /api/events - list all events
export async function GET() {
  const events = await listAllEvents()
  return NextResponse.json(events)
}
// POST /api/events - create a new event
export async function POST(req: Request) {
  const body = await req.json()
  const created = await createEvent(body)
  return NextResponse.json(created, { status: 201 })
}