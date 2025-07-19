// File: src/app/api/requests/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { listAllRequests, createRequest } from '@/lib/requestsApi'

/**
 * API handler for `/api/requests`.
 * Supports GET to list all requests and POST to create a new one.
 */
export async function GET(_: NextRequest) {
  try {
    const requests = await listAllRequests()
    return NextResponse.json(requests)
  } catch (err) {
    console.error('Failed to list requests:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const payload = {
      fullName: data.fullName as string,
      institution: data.institution as string,
      adminEmail: data.adminEmail as string,
      studentDomain: data.studentDomain as string,
      facultyDomain: data.facultyDomain as string,
    }
    const newReq = await createRequest(payload)
    return NextResponse.json(newReq, { status: 201 })
  } catch (err) {
    console.error('Failed to create request:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}