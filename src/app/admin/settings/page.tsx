// File: src/app/admin/settings/page.tsx
"use client";

import SettingsClient from "./SettingsClient";

/**
 * The Settings page route simply delegates to the `SettingsClient` component
 * which implements all of the UI logic for browsing and editing the
 * various settings categories (general, calendar, add calendar, etc.).
 */
export default function SettingsPage() {
  return <SettingsClient />;
}