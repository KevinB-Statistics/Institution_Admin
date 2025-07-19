// File: src/app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { listAllUsers } from '@/lib/usersApi'

/**
 * Simple login endpoint. Accepts a JSON body with `email` and
 * `password` and returns the matching user record if credentials
 * match. If no user is found or the password is incorrect, a 401
 * response is returned. This endpoint does not manage sessions or
 * cookies; client code should persist the returned user in
 * localStorage or another mechanism.
 */

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const users = await listAllUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 })
    }
    return NextResponse.json(user)
  } catch (err: any) {
    console.error('Failed to log in:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}