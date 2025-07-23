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
   /** Name of the user that created the event */
  creator?: string
   /** Optional URL for an event image */
  imageUrl?: string
  /** Number of user reports indicating potential issues */
  reportCount?: number
  /** Whether this event was flagged as potentially inappropriate */
  flagged?: boolean
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
   /** Name of the user that created the club */
  creator?: string
}

/**
 * Represents an institution administrator account. This minimal record
 * stores basic identity information so approved requests can log in
 * later once authentication is implemented.
 */
export interface UserRecord {
  /** Unique identifier for the user */
  id: string
  /** Institution the user belongs to */
  institution: string
  /** Full name of the admin */
  name: string
  /** Contact email for the admin */
  email: string
  /** Plain text password (placeholder for now) */
  password: string
  /** Role of the user within the institution */
  role: 'admin' | 'student' | 'faculty'
  /** Short biography or description */
  bio?: string
  /** URL for the user's profile picture */
  avatarUrl?: string
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

/**
 * Represents a user comment left on an event. Comments can be reported
 * by other users or automatically flagged by simple heuristics.
 */
export interface CommentRecord {
  /** Unique identifier for the comment */
  id: string
  /** The event this comment relates to */
  eventId: string
  /** Name of the commenting user */
  author: string
  /** Body text of the comment */
  text: string
  /** Moderation state */
  status: 'approved' | 'pending' | 'rejected'
  /** Number of user reports */
  reportCount?: number
  /** Flagged automatically as potentially inappropriate */
  flagged?: boolean
}