import React from "react";
import Link from "next/link";

export const metadata = {
  title: 'Admin – Campus Events',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-100 p-4 space-y-2 text-sm">
        <Link href="/admin" className="font-semibold block">
          Dashboard
        </Link>
        <Link href="/admin/events" className="block">
          Events
        </Link>
        <Link href="/admin/clubs" className="block">
          Clubs
        </Link>
        <Link href="/admin/reservations" className="block">
          Reservations
        </Link>
        <Link href="/admin/budget" className="block">
          Budget
        </Link>
        <Link href="/admin/users" className="block">
          Users
        </Link>
        <Link href="/admin/messaging" className="block">
          Messaging
        </Link>
        <Link href="/admin/moderation" className="block">
          Moderation
        </Link>
        <Link href="/admin/analytics" className="block">
          Analytics
        </Link>
        <Link href="/admin/settings" className="block">
          Settings
        </Link>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}