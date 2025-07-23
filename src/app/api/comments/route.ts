import { NextRequest, NextResponse } from 'next/server'
import { listAllComments, createComment } from '@/lib/commentsApi'

function isInappropriate(text: string): boolean {
  return /poop|badword/i.test(text)
}

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get('eventId')
  const comments = await listAllComments()
  const filtered = eventId ? comments.filter(c => c.eventId === eventId) : comments
  return NextResponse.json(filtered)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const flagged = isInappropriate(data.text || '')
    const newComment = await createComment({
      eventId: data.eventId,
      author: data.author || 'Unknown',
      text: data.text || '',
      status: flagged ? 'pending' : 'approved',
      flagged,
      reportCount: 0,
    })
    return NextResponse.json(newComment, { status: 201 })
  } catch (err) {
    console.error('Failed to create comment:', err)
    return new NextResponse('Invalid body', { status: 400 })
  }
}