// File: src/app/admin/page.tsx
import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard – Campus Events",
};

export default function AdminPage() {
  // Server component—no "use client" here—simply renders the interactive client
  return <AdminDashboard />;
}
