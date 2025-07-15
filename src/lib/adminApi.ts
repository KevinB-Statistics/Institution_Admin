export interface EventRecord {
  id: string
  title: string
  date: string
  status: "approved" | "pending" | "rejected" | "template"
  organizer: string
  description: string
}

const _mockEvents: EventRecord[] = [
  { id: "1", title: "Welcome Week", date: "2025-07-25", status: "approved", organizer: "Student Affairs", description: "Freshman come visit." },
  { id: "2", title: "Fall Club Fair", date: "2025-07-15", status: "approved", organizer: "Clubs Office", description: "Clubs for students." },
  { id: "3", title: "Spring Break Bash", date: "2025-07-01", status: "pending", organizer: "Events Team", description: "It's spring break!!!" },
  { id: "4", title: "Sample Template", date: "2025-07-25", status: "template", organizer: "Template Dept", description: "Sample." },
  // …add more stub events as needed
]

export async function listAllEvents(): Promise<EventRecord[]> {
  return _mockEvents
}

export async function listPendingEvents(): Promise<EventRecord[]> {
  return _mockEvents.filter((e) => e.status === "pending")
}

export async function listTemplateEvents(): Promise<EventRecord[]> {
  return _mockEvents.filter((e) => e.status === "template")
}