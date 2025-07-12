// File: src/app/admin/moderation/layout.tsx

import { Metadata } from "next";
import ModerationNav from "@/components/ModerationNav";

export const metadata: Metadata = {
  title: "Moderation – Institution Admin",
};

export default function ModerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
      {/* Client-side nav for “Reported Events” / “Images” */}
      <ModerationNav />
      {children}
    </section>
  );
}
