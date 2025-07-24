export interface ClubRecord {
  id: string
  name: string
  description?: string
}

export async function listAllClubs(): Promise<ClubRecord[]> {
  return []
}

export async function createClub(club: Omit<ClubRecord, 'id'>): Promise<ClubRecord> {
  return { id: '1', ...club }
}

export async function getClub(id: string): Promise<ClubRecord | undefined> {
  return undefined
}

export async function updateClub(id: string, data: Partial<ClubRecord>): Promise<ClubRecord | null> {
  return null
}

export async function deleteClub(id: string): Promise<boolean> {
  return false
}
