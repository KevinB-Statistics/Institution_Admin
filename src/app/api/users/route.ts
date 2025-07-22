import { NextRequest, NextResponse } from 'next/server'
import { listAllUsers } from '@/lib/usersApi'

/**
 * Simple API endpoint returning all users. In a real application
 * this would likely support pagination or authentication.
 */
export async function GET(_req: NextRequest) {
  try {
    const users = await listAllUsers()
    return NextResponse.json(users)
  } catch (err) {
    console.error('Failed to list users:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}