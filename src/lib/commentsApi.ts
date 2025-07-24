import { promises as fs } from 'fs'
import path from 'path'
import type { CommentRecord } from './types'

const COMMENTS_DB_PATH = path.join(process.cwd(), 'comments.json')

async function readComments(): Promise<CommentRecord[]> {
  try {
    const data = await fs.readFile(COMMENTS_DB_PATH, 'utf8')
    return JSON.parse(data) as CommentRecord[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeComments(comments: CommentRecord[]): Promise<void> {
  await fs.writeFile(COMMENTS_DB_PATH, JSON.stringify(comments, null, 2))
}

export async function listAllComments(): Promise<CommentRecord[]> {
  return readComments()
}

export async function listFlaggedComments(): Promise<CommentRecord[]> {
  const all = await readComments()
  return all.filter(c => c.flagged || c.reportCount && c.reportCount > 0)
}

export async function createComment(comment: Omit<CommentRecord, 'id'>): Promise<CommentRecord> {
  const all = await readComments()
  const newComment: CommentRecord = { id: Date.now().toString(), ...comment }
  all.push(newComment)
  await writeComments(all)
  return newComment
}

export async function updateComment(id: string, data: Partial<CommentRecord>): Promise<CommentRecord | null> {
  const all = await readComments()
  const idx = all.findIndex(c => c.id === id)
  if (idx === -1) return null
  all[idx] = { ...all[idx], ...data }
  await writeComments(all)
  return all[idx]
}

export async function getComment(id: string): Promise<CommentRecord | undefined> {
  const all = await readComments()
  return all.find(c => c.id === id)
}

export async function deleteComment(id: string): Promise<boolean> {
  const all = await readComments()
  const idx = all.findIndex(c => c.id === id)
  if (idx === -1) return false
  all.splice(idx, 1)
  await writeComments(all)
  return true
}
