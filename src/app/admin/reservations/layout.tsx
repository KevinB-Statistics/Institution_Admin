import React from "react";
import Link from "next/link";

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="border-b mb-4 p-2 space-x-4 text-sm">
        <Link href="/admin/reservations" className="hover:underline">
          Room Calendar
        </Link>
        <Link href="/admin/reservations/equipment" className="hover:underline">
          Equipment
        </Link>
        <Link href="/admin/reservations/requests" className="hover:underline">
          Requests
        </Link>
      </nav>
      {children}
    </div>
  );
}