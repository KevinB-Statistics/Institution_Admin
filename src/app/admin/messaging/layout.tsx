import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MessagingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col gap-1 mt-1 ml-4 text-sm">
        <Link
          href="/admin/messaging"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/messaging" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Email Composer
        </Link>
        <Link
          href="/admin/messaging/push"
          className={`rounded px-2 py-1 hover:bg-gray-100 ${
            pathname === "/admin/messaging/push" ? "bg-blue-50 font-medium text-blue-700" : ""
          }`}
        >
          Push
        </Link>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}