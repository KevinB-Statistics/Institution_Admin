// File: src/components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CalendarDays,
  Users,
  Box,
  DollarSign,
  User as SingleUser,
  Mail,
  ShieldOff,
  BarChart2,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  sub?: NavItem[];
}

// Define the primary navigation structure. Sub‑items will be rendered under their parent.
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

// Map labels to lucide icons for consistent visual language.
const ICON_MAP: Record<string, any> = {
  Dashboard: LayoutDashboard,
  Events: CalendarDays,
  Clubs: Users,
  Reservations: Box,
  Budget: DollarSign,
  Users: SingleUser,
  Messaging: Mail,
  Moderation: ShieldOff,
  Analytics: BarChart2,
  Settings: Settings,
};

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSection = (label: string) =>
    setOpen((o) => ({ ...o, [label]: !o[label] }));

  return (
    <aside
      className={`
        bg-white border-r border-gray-200 shadow-sm min-h flex flex-col
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Branding and collapse control */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        {!collapsed && (
          <span className="text-xl font-semibold text-gray-900">OverYonder</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = ICON_MAP[item.label] || null;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isSectionOpen = open[item.label];

          return (
            <div key={item.label}>
              {item.sub ? (
                <button
                  onClick={() => toggleSection(item.label)}
                  aria-expanded={isSectionOpen}
                  className={`flex items-center w-full px-3 py-2 rounded-md
                    ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
                    focus:outline-none transition-colors`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {!collapsed && (
                    <span className="ml-3 flex-1 text-left font-medium">{item.label}</span>
                  )}
                  {!collapsed && (
                    <ChevronRight
                      className={`w-4 h-4 ml-auto transition-transform ${isSectionOpen ? "rotate-90" : ""}`}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md
                    ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}
                    transition-colors`}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {!collapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </Link>
              )}
              {/* Render sub-navigation when expanded and the section is open */}
              {item.sub && isSectionOpen && !collapsed && (
                <div className="mt-1 space-y-1 pl-8">
                  {item.sub.map((sub) => {
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block text-sm px-3 py-1 rounded-md
                          ${subActive ? "font-medium bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}
                          transition-colors`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}