// File: src/lib/types.ts

/**
 * The shared event record type. This interface describes all
 * properties that an event may have within the Institution Admin
 * application. Some fields are optional because they are only
 * relevant in specific contexts (e.g. location for calendar
 * integration or recurrence rules for repeating events).
 */
export interface EventRecord {
  /** Unique identifier for the event */
  id: string
  /** Human‑readable title */
  title: string
  /** A date string in ISO format (YYYY‑MM‑DD) */
  date: string
  /** Current moderation status */
  status: 'approved' | 'pending' | 'rejected' | 'template'
  /** Name of the organizing club or person */
  organizer: string
  /** Detailed description of the event */
  description: string
  /** Optional category (e.g. Social, Academic, Sports) */
  category?: string
  /** Optional list of arbitrary tags */
  tags?: string[]
  /** Visibility control: Everyone, Club or Group */
  visibility?: string
  /** The specific club selected when visibility = Club */
  selectedClub?: string
  /** The specific group selected when visibility = Group */
  selectedGroup?: string
  /** Coordinates for map integration */
  location?: { lat: number; lng: number }
  /** ISO datetime for the start of the event */
  start?: string
  /** ISO datetime for the end of the event */
  end?: string
  /** iCalendar RRULE string representing recurrence */
  rrule?: string
  /** Timezone identifier for start/end/recurrence calculations */
  timezone?: string
}

/**
 * A club record represents an organization that can host events and have members.
 */
export interface ClubRecord {
  /** Unique identifier for the club */
  id: string
  /** Name of the club */
  name: string
  /** Longer description of the club */
  description: string
  /** Array of user identifiers or names representing members (optional) */
  members?: string[]
  /** Array of event identifiers hosted by this club (optional) */
  events?: string[]
}