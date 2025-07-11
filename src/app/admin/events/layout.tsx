"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/events"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/events" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          All Events
        </Link>
        <Link
          href="/admin/events/pending"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/events/pending"
              ? "bg-blue-50 font-medium text-blue-700"
              : ""
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/events/templates"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/events/templates"
              ? "bg-blue-50 font-medium text-blue-700"
              : ""
          }`}
        >
          Templates
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}