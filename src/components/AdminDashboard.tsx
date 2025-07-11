// File: src/components/AdminDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  CreditCard as CreditCardIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
  Star as StarOnIcon,
  StarOff as StarOffIcon,
} from "lucide-react";

type CardConfig = {
  id: string;
  title: string;
  summary: string;
  href: string;
  Icon: React.FC<any>;
};

const CARDS: CardConfig[] = [
  {
    id: "calendar",
    title: "Calendar",
    summary: "Month view & quick jumps",
    href: "/admin/calendar",
    Icon: CalendarIcon,
  },
  {
    id: "billing",
    title: "Accounts & Billing",
    summary: "Balance: $0.00",
    href: "/admin/billing",
    Icon: CreditCardIcon,
  },
  {
    id: "upcoming",
    title: "Upcoming Events",
    summary: "0 scheduled",
    href: "/admin/events",
    Icon: ClockIcon,
  },
  {
    id: "reported",
    title: "Reported Events",
    summary: "0 pending review",
    href: "/admin/moderation",
    Icon: AlertCircleIcon,
  },
];

export default function AdminDashboard() {
  const [pinned, setPinned] = useState<string[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("dashboardPinned");
    if (stored) setPinned(JSON.parse(stored));
  }, []);

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("dashboardPinned", JSON.stringify(next));
      return next;
    });
  };

  const pinnedCards = CARDS.filter((c) => pinned.includes(c.id));
  const otherCards = CARDS.filter((c) => !pinned.includes(c.id));

  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
        Institution Admin Dashboard
      </h1>

      {pinnedCards.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Pinned</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {pinnedCards.map((card) => (
              <DashboardCard
                key={card.id}
                card={card}
                isPinned
                onTogglePin={() => togglePin(card.id)}
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {otherCards.map((card) => (
          <DashboardCard
            key={card.id}
            card={card}
            isPinned={false}
            onTogglePin={() => togglePin(card.id)}
          />
        ))}
      </div>
    </section>
  );
}

type DashboardCardProps = {
  card: CardConfig;
  isPinned: boolean;
  onTogglePin: () => void;
};

function DashboardCard({ card, isPinned, onTogglePin }: DashboardCardProps) {
  return (
    <Link
      href={card.href}
      className="group relative block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition"
    >
      {/* Pin toggle */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onTogglePin();
        }}
        className="absolute top-4 right-4 z-10 text-gray-400 hover:text-yellow-500 transition"
        aria-label={isPinned ? "Unpin card" : "Pin card"}
      >
        {isPinned ? (
          <StarOnIcon className="w-5 h-5 fill-yellow-400" />
        ) : (
          <StarOffIcon className="w-5 h-5" />
        )}
      </button>

      {/* Icon */}
      <card.Icon className="w-8 h-8 text-blue-600 mb-4 transition-transform group-hover:scale-105" />

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {card.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-gray-500 dark:text-gray-400">{card.summary}</p>
    </Link>
  );
}
