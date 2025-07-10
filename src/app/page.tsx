"use client";
// src/app/page.tsx
import { useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Normally you would send this data to your backend here.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold">Thank you for registering!</h1>
        <p>
          Your information has been submitted and will be verified by the
          OverYonder admin.
        </p>
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