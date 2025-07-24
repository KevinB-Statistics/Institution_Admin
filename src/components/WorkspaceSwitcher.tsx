"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Briefcase } from "lucide-react";

const WORKSPACES = [
  { label: "Institution Admin", path: "/admin" },
  { label: "OY Admin", path: "/oyadmin" },
];

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current =
    WORKSPACES.find((w) => pathname.startsWith(w.path)) || WORKSPACES[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-4 right-4 text-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full bg-blue-600 text-white shadow"
        aria-label="Switch workspace"
      >
        <Briefcase className="w-6 h-6" />
      </button>
      {open && (
        <div className="mt-2 rounded-md shadow-lg bg-white border">
          {WORKSPACES.map((w) => (
            <button
              key={w.path}
              onClick={() => {
                router.push(w.path);
                setOpen(false);
              }}
              className={`block px-4 py-2 text-left w-full hover:bg-gray-100 ${
                current.path === w.path ? "font-semibold" : ""
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}