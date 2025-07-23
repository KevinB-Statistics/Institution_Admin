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
    console.error('Failed to read comments:', err)
    return []
  }
}

async function writeComments(comments: CommentRecord[]): Promise<void> {
  const data = JSON.stringify(comments, null, 2)
  await fs.writeFile(COMMENTS_DB_PATH, data, 'utf8')
}

export async function listAllComments(): Promise<CommentRecord[]> {
  return await readComments()
}

export async function listFlaggedComments(): Promise<CommentRecord[]> {
  const comments = await readComments()
  return comments.filter(c => c.flagged || c.reportCount && c.reportCount > 0)
}

export async function createComment(comment: Omit<CommentRecord, 'id'>): Promise<CommentRecord> {
  const comments = await readComments()
  const newComment: CommentRecord = { id: Date.now().toString(), ...comment }
  comments.push(newComment)
  await writeComments(comments)
  return newComment
}

export async function updateComment(id: string, data: Partial<CommentRecord>): Promise<CommentRecord | null> {
  const comments = await readComments()
  const idx = comments.findIndex(c => c.id === id)
  if (idx === -1) return null
  comments[idx] = { ...comments[idx], ...data, id }
  await writeComments(comments)
  return comments[idx]
}

export async function getComment(id: string): Promise<CommentRecord | undefined> {
  const comments = await readComments()
  return comments.find(c => c.id === id)
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await readComments()
  const idx = comments.findIndex(c => c.id === id)
  if (idx === -1) return false
  comments.splice(idx, 1)
  await writeComments(comments)
  return true
}