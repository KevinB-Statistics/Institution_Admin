// File: src/components/ModerationNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ModerationNav() {
  const pathname = usePathname();
  const items = [
    { href: "/admin/moderation",         label: "Reported Events" },
    { href: "/admin/moderation/images",  label: "Images"          },
  ];

  return (
    <nav className="flex flex-col gap-1 text-sm mb-4">
      {items.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded px-2 py-1 transition ${
              isActive
                ? "bg-blue-50 font-medium text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
