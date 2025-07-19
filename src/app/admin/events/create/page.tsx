"use client";

import dynamic from "next/dynamic";

// dynamically import so that @react-google-maps/api (which relies on window) never runs on the server
const CreateEventPage = dynamic(
  () => import("@/components/CreateEventPage"),
  { ssr: false }
);

export default function Page() {
  return <CreateEventPage />;
}
