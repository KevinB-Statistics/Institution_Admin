// File: src/components/AdminDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import NotificationsButton from "./NotificationsButton";
import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Combobox } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import {
  Calendar as CalendarIcon,
  CreditCard as CreditCardIcon,
  List as EventsIcon,
  Users as ClubsIcon,
  Box as ReservationsIcon,
  DollarSign as BudgetIcon,
  User as UsersIcon,
  Mail as MessagingIcon,
  ShieldOff as ModerationIcon,
  Image as ImagesIcon,
  BarChart2 as AnalyticsIcon,
  Settings as SettingsIcon,
  Star as StarOnIcon,
  StarOff as StarOffIcon,
  PlusCircle as AddIcon,
  Bell as BellIcon,
  Edit2 as EditIcon,
} from "lucide-react";

// Configuration for dashboard cards
type CardConfig = {
  id: string;
  title: string;
  summary: string;
  href: string;
  sparkData?: { value: number }[];
  Icon: React.FC<any>;
};

const DEFAULT_CARDS: CardConfig[] = [
  {
    id: "calendar",
    title: "Calendar",
    summary: "Month & year overview",
    href: "/admin/calendar",
    Icon: CalendarIcon,
    sparkData: Array.from({ length: 7 }, () => ({ value: Math.random() * 10 + 5 })),
  },
  {
    id: "billing",
    title: "Accounts & Billing",
    summary: "Balance & payments",
    href: "/admin/billing",
    Icon: CreditCardIcon,
    sparkData: Array.from({ length: 7 }, () => ({ value: Math.random() * 5000 })),
  },
  {
    id: "events",
    title: "Manage Events",
    summary: "Create, edit & approve",
    href: "/admin/events",
    Icon: EventsIcon,
    sparkData: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 20) })),
  },
  {
    id: "clubs",
    title: "Manage Clubs",
    summary: "Approve & edit clubs",
    href: "/admin/clubs",
    Icon: ClubsIcon,
  },
  {
    id: "reservations",
    title: "Reservations",
    summary: "Rooms & equipment",
    href: "/admin/reservations",
    Icon: ReservationsIcon,
  },
  {
    id: "budget",
    title: "Budget & Funding",
    summary: "Requests & allocations",
    href: "/admin/budget",
    Icon: BudgetIcon,
  },
  {
    id: "users",
    title: "Users",
    summary: "Directory & roles",
    href: "/admin/users",
    Icon: UsersIcon,
  },
  {
    id: "messaging",
    title: "Messaging",
    summary: "Email & push",
    href: "/admin/messaging",
    Icon: MessagingIcon,
  },
  {
    id: "moderation",
    title: "Moderation",
    summary: "Reported content",
    href: "/admin/moderation",
    Icon: ModerationIcon,
  },
  {
    id: "images",
    title: "Image Moderation",
    summary: "Review flagged images",
    href: "/admin/moderation/images",
    Icon: ImagesIcon,
  },
  {
    id: "analytics",
    title: "Analytics",
    summary: "Usage & performance",
    href: "/admin/analytics",
    Icon: AnalyticsIcon,
  },
  {
    id: "settings",
    title: "Settings",
    summary: "Platform configuration",
    href: "/admin/settings",
    Icon: SettingsIcon,
  },
];

// Sortable card item using dnd-kit
function SortableCard(
  props: {
    card: CardConfig;
    isPinned: boolean;
    onTogglePin: () => void;
  }
) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DashboardCard {...props} />
    </div>
  );
}

export default function AdminDashboard() {
  const [cards, setCards] = useState<CardConfig[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [visible, setVisible] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifCount, setNotifCount] = useState(3);
  const [query, setQuery] = useState("");
  const [showCmd, setShowCmd] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("dashboardOrder") || "null");
    const storedPins = JSON.parse(localStorage.getItem("dashboardPinned") || "[]");
    const storedVis  = JSON.parse(localStorage.getItem("dashboardVisible") || "null");
    setPinned(storedPins);
    setVisible(storedVis || DEFAULT_CARDS.map(c => c.id));
    const base = DEFAULT_CARDS;
    setCards(
      storedOrder
        ? storedOrder.map((id: string) => base.find(c => c.id === id)!).filter(Boolean)
        : base
    );
    // Simulate fetch delay for skeleton
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="p-6 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        ))}
      </div>
    );
  }

  const filtered = cards
    .filter(c => visible.includes(c.id))
    .filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("dashboardOrder", JSON.stringify(newItems.map(i => i.id)));
        return newItems;
      });
    }
  };

  const togglePin = (id: string) => {
    setPinned(p => {
      const next = p.includes(id) ? p.filter(x => x !== id) : [...p, id];
      localStorage.setItem("dashboardPinned", JSON.stringify(next));
      return next;
    });
  };

  const toggleVisible = (id: string) => {
    setVisible(v => {
      const next = v.includes(id) ? v.filter(x => x !== id) : [...v, id];
      localStorage.setItem("dashboardVisible", JSON.stringify(next));
      return next;
    });
  };

  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex-1">Dashboard</h1>
        <button onClick={() => setShowCmd(true)} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow">Ctrl+K</button>
        <Tippy content="Notifications">
          <button className="relative p-2 bg-white dark:bg-gray-800 rounded-full shadow">
            <BellIcon />
            {notifCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{notifCount}</span>}
          </button>
        </Tippy>
      </div>

      {/* Command Palette */}
      {showCmd && (
        <Combobox as="div" onChange={(item: any) => window.location.href = item.href} value="" nullable>
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setShowCmd(false)} />
          <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <Combobox.Input placeholder="Type to jump..." className="w-full px-3 py-2 border rounded" onChange={e => setQuery(e.target.value)} />
            <Combobox.Options className="mt-2 max-h-60 overflow-auto">
              {filtered.map(item => (
                <Combobox.Option key={item.id} value={item} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  {item.title}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      )}

      {/* Widget Toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {DEFAULT_CARDS.map(c => (
          <button key={c.id} onClick={() => toggleVisible(c.id)} className={`px-3 py-1 rounded-full text-sm ${visible.includes(c.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}> {c.title} </button>
        ))}
      </div>

      {/* Drag-and-Drop Cards */}
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={filtered.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {filtered.map(card => (
              <SortableCard key={card.id} card={card} isPinned={pinned.includes(card.id)} onTogglePin={() => togglePin(card.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

// Basic DashboardCard that supports inline edit and sparklines
function DashboardCard({ card, isPinned, onTogglePin }: { card: CardConfig; isPinned: boolean; onTogglePin: () => void; }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.summary);

  return (
    <div className="relative w-60 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-lg transition">
      <button onClick={onTogglePin} className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500">
        {isPinned ? <StarOnIcon /> : <StarOffIcon />}
      </button>
      {(() => {
        const Icon = card.Icon;
        return <Icon className="w-6 h-6 text-blue-600 mb-2" />;
      })()}
      <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">{card.title}</h3>
      {editing ? (
        <textarea value={text} onChange={e => setText(e.target.value)} onBlur={() => setEditing(false)} className="w-full p-1 border rounded bg-gray-100 dark:bg-gray-700" />
      ) : (
        <p onDoubleClick={() => setEditing(true)} className="text-sm text-gray-500 dark:text-gray-400">
          {text} <EditIcon className="inline-block w-4 h-4 text-gray-400 hover:text-gray-600" />
        </p>
      )}
      {card.sparkData && (
        <div className="mt-2 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={card.sparkData}>
              <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <Tippy content="Quick create">
        <Link href={card.href} className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800">
          <AddIcon />
        </Link>
      </Tippy>
    </div>
  );
}

/*
Dependencies to install:
 npm install recharts @dnd-kit/core @dnd-kit/sortable @headlessui/react @tippyjs/react tippy.js lucide-react
*/
