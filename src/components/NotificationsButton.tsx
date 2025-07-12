"use client";
import Tippy from "@tippyjs/react";
import { Bell as BellIcon } from "lucide-react";

export default function NotificationsButton({
  notifCount,
  onClick,
}: {
  notifCount: number;
  onClick?: () => void;
}) {
  return (
    <Tippy
      render={(attrs) => (
        <div
          {...attrs}
          className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow text-sm"
        >
          Notifications
        </div>
      )}
      interactive={true}
      placement="bottom"
    >
      <button
        onClick={onClick}
        className="relative p-2 bg-white dark:bg-gray-800 rounded-full shadow"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {notifCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {notifCount}
          </span>
        )}
      </button>
    </Tippy>
  );
}
