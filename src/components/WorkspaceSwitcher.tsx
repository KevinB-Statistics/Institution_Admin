"use client";
import { useRouter, usePathname } from "next/navigation";

const WORKSPACES = [
  { label: "Institution Admin", path: "/admin" },
  { label: "OY Admin", path: "/oyadmin" },
];

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const current =
    WORKSPACES.find((w) => pathname.startsWith(w.path)) || WORKSPACES[0];

  return (
    <select
      className="border rounded p-1 text-sm"
      value={current.path}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => router.push(e.target.value)}
    >
      {WORKSPACES.map((w) => (
        <option key={w.path} value={w.path}>
          {w.label}
        </option>
      ))}
    </select>
  );
}