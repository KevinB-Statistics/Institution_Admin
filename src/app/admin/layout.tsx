import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: 'Institution Admin – Campus Events',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-[calc(100vh-59px)] p-4">{children}</main>
    </div>
  );
}