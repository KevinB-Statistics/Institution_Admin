import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ModerationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/moderation"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/moderation" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Reported Events
        </Link>
        <Link
          href="/admin/moderation/images"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/moderation/images" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Images
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}