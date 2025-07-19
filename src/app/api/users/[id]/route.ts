// File: src/app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUser, deleteUser } from '@/lib/usersApi'

/**
 * API handler for `/api/users/:id`.
 *
 * Supports:
 *  - GET    – return the user with the specified ID or 404 if not found.
 *  - PUT    – update the user with the given ID using the JSON body.
 *  - DELETE – remove the user. Returns 204 on success.
 */

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  if (!user) {
    return new NextResponse('User not found', { status: 404 })
  }
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const updated = await updateUser(params.id, data as any)
    if (!updated) {
      return new NextResponse('User not found', { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('Failed to update user:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const ok = await deleteUser(params.id)
  if (!ok) {
    return new NextResponse('User not found', { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}