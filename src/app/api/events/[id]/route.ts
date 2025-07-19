import { NextResponse } from 'next/server'
import { getEvent, updateEvent, deleteEvent } from '@/lib/adminApi'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const event = await getEvent(params.id)
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const updated = await updateEvent(params.id, body)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteEvent(params.id)
  return NextResponse.json({ success: ok })
}
