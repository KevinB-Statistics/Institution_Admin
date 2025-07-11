import React from "react";
import Link from "next/link";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b mb-4 p-2 space-x-4 text-sm">
        <Link href="/admin/events" className="hover:underline">
          All Events
        </Link>
        <Link href="/admin/events/pending" className="hover:underline">
          Pending
        </Link>
        <Link href="/admin/events/templates" className="hover:underline">
          Templates
        </Link>
      </nav>
      {children}
    </div>
  );
}