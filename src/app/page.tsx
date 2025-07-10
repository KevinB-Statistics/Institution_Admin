// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // server-side redirect immediately to /admin
  redirect("/admin");
}
