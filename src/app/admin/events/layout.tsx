// src/app/admin/events/layout.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events – Institution Admin",
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="p-2 bg-gray-50 dark:bg-gray-900">
      {children}
    </section>
  )
}
