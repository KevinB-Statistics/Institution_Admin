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

/** Read and parse the users JSON file. Return an empty array if it doesn't exist. */
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

/** Write the given list of users to disk. */
async function writeUsers(users: UserRecord[]): Promise<void> {
  const data = JSON.stringify(users, null, 2)
  await fs.writeFile(USERS_DB_PATH, data, 'utf8')
}

/** List all users. */
export async function listAllUsers(): Promise<UserRecord[]> {
  return await readUsers()
}

/** Create a new user record. */
export async function createUser(user: Omit<UserRecord, 'id'>): Promise<UserRecord> {
  const users = await readUsers()
  const newUser: UserRecord = {
    id: Date.now().toString(),
    bio: '',
    avatarUrl: '',
    ...user,
  }
  users.push(newUser)
  await writeUsers(users)
  return newUser
}

/** Retrieve a single user by ID. */
export async function getUser(id: string): Promise<UserRecord | undefined> {
  const users = await readUsers()
  return users.find((u) => u.id === id)
}

/** Update an existing user by ID. */
export async function updateUser(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
  const users = await readUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...data, id }
  await writeUsers(users)
  return users[index]
}

/** Delete a user by ID. */
export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return false
  users.splice(index, 1)
  await writeUsers(users)
  return true
}