// File: src/components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  sub?: NavItem[];
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Events",
    href: "/admin/events",
    sub: [
      { label: "All Events", href: "/admin/events" },
      { label: "Pending", href: "/admin/events/pending" },
      { label: "Templates", href: "/admin/events/templates" },
    ],
  },
  { label: "Clubs", href: "/admin/clubs" },
  {
    label: "Reservations",
    href: "/admin/reservations",
    sub: [
      { label: "Room Calendar", href: "/admin/reservations" },
      { label: "Equipment", href: "/admin/reservations/equipment" },
      { label: "Requests", href: "/admin/reservations/requests" },
    ],
  },
  {
    label: "Budget",
    href: "/admin/budget",
    sub: [
      { label: "Funding Requests", href: "/admin/budget" },
      { label: "Allocations", href: "/admin/budget/allocations" },
      { label: "Ledger", href: "/admin/budget/ledger" },
    ],
  },
  { label: "Users", href: "/admin/users" },
  {
    label: "Messaging",
    href: "/admin/messaging",
    sub: [
      { label: "Email Composer", href: "/admin/messaging" },
      { label: "Push", href: "/admin/messaging/push" },
    ],
  },
  {
    label: "Moderation",
    href: "/admin/moderation",
    sub: [
      { label: "Reported Events", href: "/admin/moderation" },
      { label: "Images", href: "/admin/moderation/images" },
    ],
  },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSection = (label: string) =>
    setOpen((o) => ({ ...o, [label]: !o[label] }));

  return (
    <aside
      className={`bg-gray-100 border-r p-2 text-sm transition-all ${
        collapsed ? "w-12" : "w-56"
      }`}
    >
      {/* Collapse/expand button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-2 w-full text-left"
      >
        {collapsed ? "▶ Menu" : "◀ Menu"}
      </button>

      {!collapsed && (
        <nav className="space-y-2">
          {NAV.map((item) => (
            <div key={item.label}>
              {item.sub ? (
                <button
                  onClick={() => toggleSection(item.label)}
                  className="flex w-full items-center justify-between rounded px-2 py-1 hover:bg-gray-200"
                >
                  <span
                    className={
                      pathname.startsWith(item.href) ? "font-semibold" : ""
                    }
                  >
                    {item.label}
                  </span>
                  <span>{open[item.label] ? "▼" : "▶"}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`block rounded px-2 py-1 hover:bg-gray-200 ${
                    pathname === item.href ? "font-semibold bg-blue-50" : ""
                  }`}
                >
                  {item.label}
                </Link>
              )}

              {item.sub && open[item.label] && (
                <div className="ml-4 mt-1 flex flex-col gap-1 text-sm">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block rounded px-2 py-1 hover:bg-gray-100 ${
                        pathname === sub.href
                          ? "font-medium text-blue-700 bg-blue-50"
                          : ""
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </aside>
  );
}
