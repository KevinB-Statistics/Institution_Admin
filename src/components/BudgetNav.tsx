// File: src/components/BudgetNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BudgetNav() {
  const pathname = usePathname();

  const items = [
    { href: "/admin/budget",           label: "Funding Requests" },
    { href: "/admin/budget/allocations", label: "Allocations"     },
    { href: "/admin/budget/ledger",      label: "Ledger"          },
  ];

  return (
    <nav className="flex flex-col gap-1 text-sm mb-4">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded px-2 py-1 transition ${
              isActive
                ? "bg-blue-50 font-medium text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
