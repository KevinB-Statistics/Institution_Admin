import React from "react";
import Link from "next/link";

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b mb-4 p-2 space-x-4 text-sm">
        <Link href="/admin/budget" className="hover:underline">
          Funding Requests
        </Link>
        <Link href="/admin/budget/allocations" className="hover:underline">
          Allocations
        </Link>
        <Link href="/admin/budget/ledger" className="hover:underline">
          Ledger
        </Link>
      </nav>
      {children}
    </div>
  );
}