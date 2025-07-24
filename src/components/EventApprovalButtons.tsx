"use client"
import type { FC } from 'react'

interface Props {
  eventId: string
}

const EventApprovalButtons: FC<Props> = () => (
  <div className="flex space-x-2">
    <button className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
    <button className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
  </div>
)

export default EventApprovalButtons