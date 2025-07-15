// File: src/components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

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
      className={`
        bg-white border-r shadow-sm
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-14" : "w-56"}
      `}
    >
      {/* collapse/expand: icon left-justified with custom tooltip */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="
          mb-4 flex items-center justify-start
          w-full px-2 h-10
          relative
          rounded hover:bg-gray-100 focus:outline-none focus:ring
          group
        "
      >
        <div className="relative w-6 h-6">
          <ChevronLeft
            className={`
              absolute top-0 left-0 w-6 h-6
              transition-opacity duration-200
              ${collapsed ? "opacity-0" : "opacity-100"}
            `}
          />
          <Menu
            className={`
              absolute top-0 left-0 w-6 h-6
              transition-opacity duration-200
              ${collapsed ? "opacity-100" : "opacity-0"}
            `}
          />
        </div>
        <span
          className={`
            absolute left-10 top-1/2 -translate-y-1/2
            whitespace-nowrap px-2 py-1
            bg-black text-white text-xs
            rounded-md
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          `}
        >
          {collapsed ? "Open sidebar" : "Close sidebar"}
        </span>
      </button>

      {!collapsed && (
        <nav className="space-y-1 px-2">
          {NAV.map((item) => (
            <div key={item.label}>
              {item.sub ? (
                <button
                  onClick={() => toggleSection(item.label)}
                  aria-expanded={open[item.label]}
                  className="
                    flex items-center justify-between
                    w-full px-3 py-2
                    rounded-lg
                    text-gray-700 hover:bg-gray-100
                    focus:outline-none focus:bg-gray-100
                  "
                >
                  <span
                    className={`flex-1 text-left ${
                      pathname.startsWith(item.href)
                        ? "font-semibold text-gray-900"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  <ChevronRight
                    className={`
                      w-4 h-4
                      text-gray-500
                      transition-transform duration-200
                      ${open[item.label] ? "rotate-90" : ""}
                    `}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    block px-3 py-2 rounded-lg
                    text-gray-700 hover:bg-gray-100
                    ${pathname === item.href
                      ? "font-semibold bg-blue-50 text-blue-700"
                      : ""}
                  `}
                >
                  {item.label}
                </Link>
              )}

              {item.sub && open[item.label] && (
                <div className="mt-1 space-y-1 pl-6">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`
                        block px-3 py-1 rounded-lg text-sm
                        text-gray-600 hover:bg-gray-50
                        ${pathname === sub.href
                          ? "font-medium text-blue-700 bg-blue-50"
                          : ""}
                      `}
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

