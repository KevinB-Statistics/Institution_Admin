import { NextRequest, NextResponse } from 'next/server'
import { getEvent, updateEvent } from '@/lib/adminApi'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const ev = await getEvent(params.id)
  if (!ev) return new NextResponse('Not found', { status: 404 })
  const newCount = (ev.reportCount ?? 0) + 1
  const updated = await updateEvent(params.id, { reportCount: newCount, flagged: true })
  return NextResponse.json(updated)
}