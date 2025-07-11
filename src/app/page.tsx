"use client";
// src/app/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const request = {
      id: Date.now().toString(),
      fullName: data.get("fullName"),
      institution: data.get("institution"),
      adminEmail: data.get("adminEmail"),
      studentDomain: data.get("studentDomain"),
      facultyDomain: data.get("facultyDomain"),
      status: "pending",
    } as any;
    const existing = JSON.parse(localStorage.getItem("requests") || "[]");
    existing.push(request);
    localStorage.setItem("requests", JSON.stringify(existing));
    localStorage.setItem("pendingRequestId", request.id);
    setSubmitted(true);
  }

  useEffect(() => {
    if (!submitted) return;
    const id = localStorage.getItem("pendingRequestId");
    if (!id) return;
    const interval = setInterval(() => {
      const stored = JSON.parse(localStorage.getItem("requests") || "[]");
      const req = stored.find((r: any) => r.id === id);
      if (req?.status === "approved") {
        clearInterval(interval);
        localStorage.removeItem("pendingRequestId");
        router.push("/admin");
      } else if (req?.status === "declined") {
        clearInterval(interval);
        localStorage.removeItem("pendingRequestId");
        setDeclined(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, router]);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
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
    <div className="min-h-screen flex items-center justify-center p-4">
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
            type="text"
            placeholder="students.yourschool.edu"
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
            type="text"
            placeholder="faculty.yourschool.edu"
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