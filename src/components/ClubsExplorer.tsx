// File: src/components/ClubsExplorer.tsx

"use client"

import type { FC } from 'react'
import type { ClubRecord } from '@/lib/types'

interface Props {
   clubs: ClubRecord[]
}

const ClubsExplorer: FC<Props> = ({ clubs }) => (
  <div>{clubs.map(c => <div key={c.id}>{c.name}</div>)}</div>
)

export default ClubsExplorer