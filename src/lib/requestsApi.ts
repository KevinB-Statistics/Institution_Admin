// File: src/lib/requestsApi.ts

import { promises as fs } from 'fs'
import path from 'path'
import type { RequestRecord } from './types'
import { createUser, listAllUsers } from './usersApi'

/**
 * Path to the local JSON database file for onboarding requests.
 * This file is stored at the project root next to `users.json`.
 */
const REQUESTS_DB_PATH = path.join(process.cwd(), 'requests.json')

/** Read all requests from disk or return an empty array if the file doesn't exist. */
async function readRequests(): Promise<RequestRecord[]> {
  try {
    const data = await fs.readFile(REQUESTS_DB_PATH, 'utf8')
    return JSON.parse(data) as RequestRecord[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    console.error('Failed to read requests:', err)
    return []
  }
}

/** Write the provided requests back to the JSON file. */
async function writeRequests(requests: RequestRecord[]): Promise<void> {
  const data = JSON.stringify(requests, null, 2)
  await fs.writeFile(REQUESTS_DB_PATH, data, 'utf8')
}

/** Return all onboarding requests. */
export async function listAllRequests(): Promise<RequestRecord[]> {
  return await readRequests()
}

/** Create a new onboarding request record. */
export async function createRequest(
  req: Omit<RequestRecord, 'id' | 'status'>
): Promise<RequestRecord> {
  const requests = await readRequests()
  const newRequest: RequestRecord = {
    id: Date.now().toString(),
    status: 'pending',
    ...req,
  }
  requests.push(newRequest)
  await writeRequests(requests)
  return newRequest
}

/** Retrieve a single request by ID. */
export async function getRequest(id: string): Promise<RequestRecord | undefined> {
  const requests = await readRequests()
  return requests.find((r) => r.id === id)
}

/** Update an existing request. Only provided fields will be overwritten. */
export async function updateRequest(
  id: string,
  data: Partial<RequestRecord>
): Promise<RequestRecord | null> {
  const requests = await readRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index === -1) return null
  const previous = requests[index]
  requests[index] = { ...requests[index], ...data, id }
  await writeRequests(requests)

  // When a request transitions to approved, create a user record if one doesn't exist
  if (previous.status !== 'approved' && requests[index].status === 'approved') {
    const users = await listAllUsers()
    const exists = users.some((u) => u.email === requests[index].adminEmail)
    if (!exists) {
      await createUser({
        institution: requests[index].institution,
        name: requests[index].fullName,
        email: requests[index].adminEmail,
        password: '',
        bio: '',
        avatarUrl: ''
      })
    }
  }

  return requests[index]
}

/** Delete a request by ID. */
export async function deleteRequest(id: string): Promise<boolean> {
  const requests = await readRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index === -1) return false
  requests.splice(index, 1)
  await writeRequests(requests)
  return true
}