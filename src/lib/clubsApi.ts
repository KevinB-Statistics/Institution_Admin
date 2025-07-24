import { promises as fs } from 'fs'
import path from 'path'
import type { ClubRecord } from './types'

const CLUBS_DB_PATH = path.join(process.cwd(), 'clubs.json')

async function readClubs(): Promise<ClubRecord[]> {
  try {
    const data = await fs.readFile(CLUBS_DB_PATH, 'utf8')
    return JSON.parse(data) as ClubRecord[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeClubs(clubs: ClubRecord[]): Promise<void> {
  await fs.writeFile(CLUBS_DB_PATH, JSON.stringify(clubs, null, 2))
}

export async function listAllClubs(): Promise<ClubRecord[]> {
  return readClubs()
}

export async function createClub(club: Omit<ClubRecord, 'id'>): Promise<ClubRecord> {
  const all = await readClubs()
  const newClub: ClubRecord = { id: Date.now().toString(), ...club }
  all.push(newClub)
  await writeClubs(all)
  return newClub
}

export async function getClub(id: string): Promise<ClubRecord | undefined> {
  const all = await readClubs()
  return all.find(c => c.id === id)
}

export async function updateClub(id: string, data: Partial<ClubRecord>): Promise<ClubRecord | null> {
  const all = await readClubs()
  const idx = all.findIndex(c => c.id === id)
  if (idx === -1) return null
  all[idx] = { ...all[idx], ...data }
  await writeClubs(all)
  return all[idx]
}

export async function deleteClub(id: string): Promise<boolean> {
  const all = await readClubs()
  const idx = all.findIndex(c => c.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  await writeClubs(all)
  return true
}