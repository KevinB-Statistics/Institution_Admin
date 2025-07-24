"use client";

import { useState } from "react";

/**
 * SettingsClient provides a structured settings experience inspired by
 * contemporary calendar dashboards.  It exposes a side navigation with
 * collapsible groups for General, Calendar and Add Calendar settings.
 * Selecting a row from the navigation drives the content area on the right.
 */
export default function SettingsClient() {
  type Item = { id: string; label: string };
  type Group = { heading: string; items: Item[] };

  // Define the available groups and items for the settings navigation.
  const groups: Group[] = [
    {
      heading: "GENERAL",
      items: [
        { id: "language", label: "Language & Region" },
        { id: "timezone", label: "Time Zone" },
        { id: "worldClock", label: "World Clock" },
        { id: "eventSettings", label: "Event Settings" },
        { id: "notification", label: "Notification Settings" },
        { id: "viewOptions", label: "View Options" },
        { id: "shortcuts", label: "Keyboard Shortcuts" },
      ],
    },
    {
      heading: "CALENDAR",
      items: [
        { id: "myCalendars", label: "My Calendars" },
        { id: "otherCalendars", label: "Other Calendars" },
        { id: "categories", label: "Categories" },
      ],
    },
    {
      heading: "ADD CALENDAR",
      items: [
        { id: "subscribe", label: "Subscribe to Calendar" },
        { id: "create", label: "Create New Calendar" },
        { id: "browse", label: "Browse Calendar" },
        { id: "fromUrl", label: "From URL" },
      ],
    },
  ];

  // Track which navigation item is currently active.
  const [activeItem, setActiveItem] = useState<string>("myCalendars");
  // Track which calendar is selected when editing calendar details.
  const [selectedCalendar, setSelectedCalendar] = useState<string>("social");

  // Sample calendar data for demonstration.  In a real application
  // these values would come from the server.
  const calendars = [
    {
      id: "social",
      name: "Social",
      color: "#38bdf8",
      owner: "Esther Howard",
      tag: "General",
      description: "Social gatherings and meetups.",
      notification: "10 minutes before",
    },
    {
      id: "academic",
      name: "Academic",
      color: "#818cf8",
      owner: "Esther Howard",
      tag: "Work",
      description: "Classes, lectures and study sessions.",
      notification: "15 minutes before",
    },
    {
      id: "sports",
      name: "Sports",
      color: "#34d399",
      owner: "Esther Howard",
      tag: "Personal",
      description: "Games, practices and fitness.",
      notification: "20 minutes before",
    },
    {
      id: "cultural",
      name: "Cultural",
      color: "#fbbf24",
      owner: "Esther Howard",
      tag: "Hobby",
      description: "Cultural events and festivals.",
      notification: "30 minutes before",
    },
  ];

  // Retrieve the active calendar object for editing when the "myCalendars"
  // section is active.
  const activeCalendar = calendars.find((c) => c.id === selectedCalendar);

  // Render functions for the content area.
  function renderContent() {
    if (activeItem === "myCalendars") {
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4">My Calendars</h2>
          <div className="flex gap-6">
            {/* List of calendars on the left */}
            <div className="w-64 space-y-2">
              {calendars.map((cal) => {
                const isActive = selectedCalendar === cal.id;
                return (
                  <button
                    key={cal.id}
                    onClick={() => setSelectedCalendar(cal.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-md border text-left transition-colors
                      ${isActive ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"}`}
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-full mr-3"
                      style={{ backgroundColor: cal.color }}
                    />
                    <span className="text-sm font-medium flex-1">{cal.name}</span>
                  </button>
                );
              })}
            </div>
            {/* Calendar settings form */}
            {activeCalendar && (
              <form className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="calendarName">
                    Calendar Name
                  </label>
                  <input
                    id="calendarName"
                    type="text"
                    defaultValue={activeCalendar.name}
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="calendarOwner">
                    Owner
                  </label>
                    <input
                      id="calendarOwner"
                      type="text"
                      defaultValue={activeCalendar.owner}
                      className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="calendarTag">
                    Tag
                  </label>
                  <input
                    id="calendarTag"
                    type="text"
                    defaultValue={activeCalendar.tag}
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="calendarColor">
                    Colour
                  </label>
                  <input
                    id="calendarColor"
                    type="color"
                    defaultValue={activeCalendar.color}
                    className="h-10 w-20 border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="calendarNotification">
                    Event Notification
                  </label>
                  <input
                    id="calendarNotification"
                    type="text"
                    defaultValue={activeCalendar.notification}
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }
    // Placeholder for other settings categories
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">{groups.flatMap((g) => g.items).find((i) => i.id === activeItem)?.label}</h2>
        <p className="text-gray-600 text-sm">This section is under construction.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      {/* Search bar at the top */}
      <div className="max-w-md">
        <input
          type="search"
          placeholder="Search for anything"
          className="w-full rounded border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {/* Content container */}
      <div className="flex flex-1 overflow-hidden mt-4 rounded-lg border bg-white shadow-sm">
        {/* Settings navigation */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.heading} className="mb-6">
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {group.heading}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveItem(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {/* Settings content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}