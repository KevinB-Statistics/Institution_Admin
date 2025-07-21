// File: src/app/api/requests/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getRequest, updateRequest, deleteRequest } from '@/lib/requestsApi'

/**
 * API handler for `/api/requests/:id`.
 * Supports GET, PUT and DELETE operations on a single request.
 */
export async function GET(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const req = await getRequest(id)
  if (!req) return new NextResponse('Request not found', { status: 404 })
  return NextResponse.json(req)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json()
    const { id } = await params
    const updated = await updateRequest(id, data)
    if (!updated) return new NextResponse('Request not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Failed to update request:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = await deleteRequest(id)
  if (!ok) return new NextResponse('Request not found', { status: 404 })
  return new NextResponse(null, { status: 204 })
}