"use client";
// src/app/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const router = useRouter();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName"),
      institution: data.get("institution"),
      adminEmail: data.get("adminEmail"),
      studentDomain: data.get("studentDomain"),
      facultyDomain: data.get("facultyDomain"),
      };
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create request");
      const created = await res.json();
      localStorage.setItem("pendingRequestId", created.id);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    // Check for an existing pending request when the component mounts
    const id = localStorage.getItem("pendingRequestId");
    if (id) setSubmitted(true);
  }, []);

  useEffect(() => {
    if (!submitted) return;
    const id = localStorage.getItem("pendingRequestId");
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/requests/${id}`);
        if (!res.ok) return;
        const req = await res.json();
        if (req.status === "approved") {
          clearInterval(interval);
          localStorage.removeItem("pendingRequestId");
          router.push("/admin");
        } else if (req.status === "declined") {
          clearInterval(interval);
          localStorage.removeItem("pendingRequestId");
          setDeclined(true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, router]);

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 space-y-4">
        {declined ? (
          <>
            <h1 className="text-2xl font-bold text-red-600">Request Declined</h1>
            <p>Your institution request was declined.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Thank you for registering!</h1>
            <p>
              Your information has been submitted and will be verified by the
              OverYonder admin.
            </p>
            <p className="text-sm text-gray-600">This page will redirect once approved.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow rounded p-6 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-2">Institution Onboarding</h1>
        <div>
          <label className="block mb-1 font-medium" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="institution">
            Institution Name
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="adminEmail">
            Admin Email
          </label>
          <input
            id="adminEmail"
            name="adminEmail"
            type="email"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="studentDomain">
            Student Email Domain
          </label>
          <input
            id="studentDomain"
            name="studentDomain"
            type="text"
            placeholder="@students.yourschool.edu"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="facultyDomain">
            Faculty Email Domain
          </label>
          <input
            id="facultyDomain"
            name="facultyDomain"
            type="text"
            placeholder="@faculty.yourschool.edu"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}