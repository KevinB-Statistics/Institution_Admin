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

/**
 * Represents an institution administrator or user account within the
 * application. This record stores basic identity information for the
 * admin along with the institution they represent. In a real system
 * you would likely include hashed passwords, roles and additional
 * metadata. For this file‑based prototype we keep the fields simple.
 */
export interface UserRecord {
  /** Unique identifier for the user */
  id: string
  /** The name of the institution this admin belongs to (e.g. University of Idaho) */
  institution: string
  /** Full name of the admin */
  name: string
  /** Contact email for the admin. Must be unique across users */
  email: string
  /** Plain text password for the admin. In production this should be hashed */
  password: string
}

/**
 * Represents a pending onboarding request submitted from the main landing page.
 * Requests are stored server-side so the OverYonder admin can review them.
 */
export interface RequestRecord {
  /** Unique identifier for the request */
  id: string
  /** Requester's full name */
  fullName: string
  /** Name of the institution requesting access */
  institution: string
  /** Contact email for the admin */
  adminEmail: string
  /** Email domain used for students (e.g. students.example.edu) */
  studentDomain: string
  /** Email domain used for faculty (e.g. faculty.example.edu) */
  facultyDomain: string
  /** Current moderation status for the request */
  status: 'pending' | 'approved' | 'declined'
}