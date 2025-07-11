"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/clubs"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/clubs" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Clubs
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}