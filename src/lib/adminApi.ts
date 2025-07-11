export interface EventRecord {
  id: string
  title: string
  date: string
  status: "approved" | "pending" | "rejected" | "template"
  organizer: string
}

const _mockEvents: EventRecord[] = [
  { id: "1", title: "Welcome Week", date: "2025-08-25", status: "approved", organizer: "Student Affairs" },
  { id: "2", title: "Fall Club Fair", date: "2025-09-05", status: "approved", organizer: "Clubs Office" },
  { id: "3", title: "Spring Break Bash", date: "2025-03-12", status: "pending", organizer: "Events Team" },
  { id: "4", title: "Sample Template", date: "2025-01-01", status: "template", organizer: "Template Dept" },
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