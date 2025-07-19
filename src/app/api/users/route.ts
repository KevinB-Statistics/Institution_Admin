// File: src/app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { listAllUsers, createUser } from '@/lib/usersApi'

/**
 * API handler for `/api/users`.
 *
 * Supports the following HTTP methods:
 *  - GET  – return all users in the database as JSON.
 *  - POST – create a new user account from the JSON body.
 */

// GET: return all users
export async function GET(_: NextRequest) {
  try {
    const users = await listAllUsers()
    return NextResponse.json(users)
  } catch (err) {
    console.error('Failed to list users:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// POST: create a new user
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Construct a user payload. The caller must provide institution,
    // name, email and password. We do not perform validation here to
    // keep the API simple.
    const payload = {
      institution: data.institution,
      name: data.name,
      email: data.email,
      password: data.password,
    }
    const newUser = await createUser(payload as any)
    return NextResponse.json(newUser, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create user:', err)
    return new NextResponse('Invalid request body', { status: 400 })
  }
}