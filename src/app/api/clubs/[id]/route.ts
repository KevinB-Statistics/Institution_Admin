// File: src/app/api/clubs/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getClub, updateClub, deleteClub } from '@/lib/clubsApi'

/**
 * API handler for `/api/clubs/:id`.
 *
 * Supports:
 *  - GET    – returns the specified club or 404 if missing.
 *  - PUT    – updates the club with provided fields.
 *  - DELETE – removes the club.
 */
export async function GET(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const club = await getClub(id)
  if (!club) return new NextResponse('Club not found', { status: 404 })
  return NextResponse.json(club)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json()
    const { id } = await params
    const updated = await updateClub(id, data)
    if (!updated) return new NextResponse('Club not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Failed to update club:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = await deleteClub(id)
  if (!ok) return new NextResponse('Club not found', { status: 404 })
  return new NextResponse(null, { status: 204 })
}