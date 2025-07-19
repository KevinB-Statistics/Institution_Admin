// Back in src/app/admin/budget/layout.tsx
import { Metadata } from "next";
import BudgetNav from "@/components/BudgetNav";

export const metadata: Metadata = {
  title: "Budget – Institution Admin",
};

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full space-y-6">
      <BudgetNav />
      {children}
    </section>
  );
}
