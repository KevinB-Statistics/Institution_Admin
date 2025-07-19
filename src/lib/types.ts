export interface EventRecord {
  id: string
  title: string
  date: string
  status: 'approved' | 'pending' | 'rejected' | 'template'
  organizer: string
  description: string
  category?: string
  tags?: string[]
  visibility?: string
  selectedClub?: string
  selectedGroup?: string
  location?: { lat: number; lng: number }
  start?: string
  end?: string
  rrule?: string
  timezone?: string
}