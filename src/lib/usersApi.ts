// File: src/lib/usersApi.ts

import { promises as fs } from 'fs'
import path from 'path'
import type { UserRecord } from './types'

/**
 * Path to the local JSON database file for users. This file sits at
 * the project root and stores an array of user account objects. If
 * the file does not exist it is created lazily on the first write.
 */
const USERS_DB_PATH = path.join(process.cwd(), 'users.json')

/**
 * Read and parse the users JSON file. If the file is missing this
 * returns an empty array. Unexpected errors are logged and an empty
 * array is returned to keep the server resilient.
 */
async function readUsers(): Promise<UserRecord[]> {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf8')
    return JSON.parse(data) as UserRecord[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    console.error('Failed to read users:', err)
    return []
  }
}

/**
 * Write the given list of users back to the JSON file. The data is
 * pretty‑printed with two spaces for easier inspection.
 */
async function writeUsers(users: UserRecord[]): Promise<void> {
  const data = JSON.stringify(users, null, 2)
  await fs.writeFile(USERS_DB_PATH, data, 'utf8')
}

/**
 * Return all user records. Always reads from disk to ensure fresh data.
 */
export async function listAllUsers(): Promise<UserRecord[]> {
  return await readUsers()
}

/**
 * Create a new user account. A new unique ID is generated from the
 * current timestamp. The caller must provide all other fields (see
 * {@link UserRecord} for required properties). Emails should be
 * unique; this function does not enforce uniqueness but a client or
 * separate login endpoint can handle duplicates.
 */
export async function createUser(user: Omit<UserRecord, 'id'>): Promise<UserRecord> {
  const users = await readUsers()
  const newId = Date.now().toString()
  const newUser: UserRecord = { id: newId, ...user }
  users.push(newUser)
  await writeUsers(users)
  return newUser
}

/**
 * Retrieve a user by their unique ID. Returns undefined if not found.
 */
export async function getUser(id: string): Promise<UserRecord | undefined> {
  const users = await readUsers()
  return users.find((u) => u.id === id)
}

/**
 * Update an existing user record. Merges the provided partial data
 * onto the user with the given ID. Returns the updated user or null
 * if no user was found. Note that changing the email does not enforce
 * uniqueness.
 */
export async function updateUser(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
  const users = await readUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...data, id }
  await writeUsers(users)
  return users[index]
}

/**
 * Delete a user account by ID. Returns true if the user existed and
 * was removed, otherwise false.
 */
export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return false
  users.splice(index, 1)
  await writeUsers(users)
  return true
}