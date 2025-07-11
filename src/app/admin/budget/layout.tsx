import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/budget"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/budget" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Funding Requests
        </Link>
        <Link
          href="/admin/budget/allocations"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/budget/allocations" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Allocations
        </Link>
        <Link
          href="/admin/budget/ledger"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/budget/ledger" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Ledger
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}