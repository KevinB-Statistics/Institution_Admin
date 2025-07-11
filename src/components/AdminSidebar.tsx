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
      className={`bg-gray-100 border-r p-2 text-sm transition-all ${collapsed ? "w-12" : "w-56"}`}
    >
      <button onClick={() => setCollapsed(!collapsed)} className="mb-2 w-full text-left">
        {collapsed ? "\u25B6" : "\u25C0"} Menu
      </button>
      {!collapsed && (
        <nav className="space-y-2">
          {NAV.map((item) => (
            <div key={item.label}>
              {item.sub ? (
                <button
                  onClick={() => toggleSection(item.label)}
                  className="flex w-full items-center justify-between"
                >
                  <span className={pathname.startsWith(item.href) ? "font-semibold" : ""}>{item.label}</span>
                  <span>{open[item.label] ? "\u25BC" : "\u25B6"}</span>
                </button>
              ) : (
                <Link href={item.href} className={pathname === item.href ? "font-semibold" : ""}>
                  {item.label}
                </Link>
              )}
              {item.sub && open[item.label] && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.sub.map((sub) => (
                    <Link key={sub.href} href={sub.href} className={pathname === sub.href ? "font-semibold" : ""}>
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