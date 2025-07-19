// File: src/app/api/clubs/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { listAllClubs, createClub } from '@/lib/clubsApi'

/**
 * API handler for `/api/clubs`.
 *
 * Supports:
 *  - GET  – returns all clubs as JSON.
 *  - POST – creates a new club. Name and description are required.
 */
export async function GET(_: NextRequest) {
  try {
    const clubs = await listAllClubs()
    return NextResponse.json(clubs)
  } catch (err) {
    console.error('Failed to list clubs:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Validate required fields
    if (!data?.name || !data?.description) {
      return new NextResponse('Missing required fields', { status: 400 })
    }
    const payload = {
      name: data.name as string,
      description: data.description as string,
      members: data.members as string[] | undefined,
      events: data.events as string[] | undefined,
    }
    const newClub = await createClub(payload)
    return NextResponse.json(newClub, { status: 201 })
  } catch (err) {
    console.error('Failed to create club:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}