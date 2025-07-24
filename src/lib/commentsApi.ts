export interface CommentRecord {
  id: string
  author: string
  text: string
}

export async function listAllComments(): Promise<CommentRecord[]> {
  return []
}

export async function listFlaggedComments(): Promise<CommentRecord[]> {
  return []
}

export async function createComment(comment: Omit<CommentRecord, 'id'>): Promise<CommentRecord> {
  return { id: '1', ...comment }
}

export async function updateComment(id: string, data: Partial<CommentRecord>): Promise<CommentRecord | null> {
  return null
}

export async function getComment(id: string): Promise<CommentRecord | undefined> {
  return undefined
}

export async function deleteComment(id: string): Promise<boolean> {
  return false
}