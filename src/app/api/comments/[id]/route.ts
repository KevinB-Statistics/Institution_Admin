import { NextRequest, NextResponse } from 'next/server'
import { getComment, updateComment, deleteComment } from '@/lib/commentsApi'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const comment = await getComment(params.id)
  if (!comment) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(comment)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const updated = await updateComment(params.id, data)
    if (!updated) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Failed to update comment:', err)
    return new NextResponse('Invalid body', { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const ok = await deleteComment(params.id)
  if (!ok) return new NextResponse('Not found', { status: 404 })
  return new NextResponse(null, { status: 204 })
}