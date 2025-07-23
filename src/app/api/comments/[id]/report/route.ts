import { NextRequest, NextResponse } from 'next/server'
import { getComment, updateComment } from '@/lib/commentsApi'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const c = await getComment(params.id)
  if (!c) return new NextResponse('Not found', { status: 404 })
  const newCount = (c.reportCount ?? 0) + 1
  const updated = await updateComment(params.id, { reportCount: newCount, flagged: true })
  return NextResponse.json(updated)
}