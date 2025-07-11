"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/reservations"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/reservations" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Room Calendar
        </Link>
        <Link
          href="/admin/reservations/equipment"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/reservations/equipment"
              ? "bg-blue-50 font-medium text-blue-700"
              : ""
          }`}
        >
          Equipment
        </Link>
        <Link
          href="/admin/reservations/requests"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/reservations/requests"
              ? "bg-blue-50 font-medium text-blue-700"
              : ""
          }`}
        >
          Requests
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}