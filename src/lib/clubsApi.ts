// File: src/lib/clubsApi.ts

import { promises as fs } from 'fs'
import path from 'path'
import type { ClubRecord } from './types'

/**
 * Path to the local JSON database file for clubs. The file lives in the
 * project root alongside `events.json` and persists clubs between server
 * restarts. If the file does not exist it will be created on demand.
 */
const CLUBS_DB_PATH = path.join(process.cwd(), 'clubs.json')

async function readClubs(): Promise<ClubRecord[]> {
  try {
    const data = await fs.readFile(CLUBS_DB_PATH, 'utf8')
    return JSON.parse(data) as ClubRecord[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    console.error('Failed to read clubs:', err)
    return []
  }
}

async function writeClubs(clubs: ClubRecord[]): Promise<void> {
  const data = JSON.stringify(clubs, null, 2)
  await fs.writeFile(CLUBS_DB_PATH, data, 'utf8')
}

/**
 * List all clubs. This reads the file on each invocation to ensure fresh
 * data. Consider caching results in a real application.
 */
export async function listAllClubs(): Promise<ClubRecord[]> {
  return await readClubs()
}

/**
 * Create a new club record. A unique ID is assigned automatically. The
 * caller provides all other fields except `id`. Returns the newly
 * created club.
 */
export async function createClub(club: Omit<ClubRecord, 'id'>): Promise<ClubRecord> {
  const clubs = await readClubs()
  const newId = Date.now().toString()
  const newClub: ClubRecord = { id: newId, ...club }
  clubs.push(newClub)
  await writeClubs(clubs)
  return newClub
}

/**
 * Retrieve a single club by its ID.
 */
export async function getClub(id: string): Promise<ClubRecord | undefined> {
  const clubs = await readClubs()
  return clubs.find((c) => c.id === id)
}

/**
 * Update an existing club. If found, merges the provided data into the
 * existing club and writes the file back. Returns the updated record or
 * null if no club was found.
 */
export async function updateClub(id: string, data: Partial<ClubRecord>): Promise<ClubRecord | null> {
  const clubs = await readClubs()
  const index = clubs.findIndex((c) => c.id === id)
  if (index === -1) return null
  clubs[index] = { ...clubs[index], ...data, id }
  await writeClubs(clubs)
  return clubs[index]
}

/**
 * Delete a club by its ID. Returns true if the club existed and was
 * removed, otherwise false.
 */
export async function deleteClub(id: string): Promise<boolean> {
  const clubs = await readClubs()
  const index = clubs.findIndex((c) => c.id === id)
  if (index === -1) return false
  clubs.splice(index, 1)
  await writeClubs(clubs)
  return true
}