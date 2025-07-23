"use client"

import { useEffect, useState } from 'react'
import useCurrentUser from '@/hooks/useCurrentUser'

interface Comment {
  id: string
  author: string
  text: string
  reportCount?: number
}

export default function CommentsSection({ eventId }: { eventId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const user = useCurrentUser()

  useEffect(() => {
    fetch(`/api/comments?eventId=${eventId}`)
      .then(r => r.json())
      .then(setComments)
  }, [eventId])

  async function submit() {
    if (!text) return
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, author: user?.name, text })
    })
    const c = await res.json()
    setComments(prev => [...prev, c])
    setText('')
  }

  async function report(id: string) {
    await fetch(`/api/comments/${id}/report`, { method: 'POST' })
    setComments(prev => prev.map(c => c.id === id ? { ...c, reportCount: (c.reportCount ?? 0) + 1 } : c))
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Comments</h3>
      <div className="space-y-2">
        {comments.map(c => (
          <div key={c.id} className="border rounded p-2">
            <p className="text-sm font-medium">{c.author}</p>
            <p className="text-sm">{c.text}</p>
            <button onClick={() => report(c.id)} className="text-xs text-red-600">Report</button>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Add a comment"
        />
        <button onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Post</button>
      </div>
    </div>
  )
}