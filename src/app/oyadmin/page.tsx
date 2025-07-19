"use client";
import { useEffect, useState } from "react";
import type { RequestRecord } from "@/lib/types";



export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRequests)
      .catch((err) => console.error(err));
  }, []);

  async function updateStatus(id: string, status: "approved" | "declined") {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setRequests((reqs) =>
        reqs.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Signup Requests</h1>
      <ul className="space-y-4">
        {requests.map((r) => (
          <li key={r.id} className="border p-4 rounded">
            <p className="font-medium">{r.institution}</p>
            <p className="text-sm">{r.adminEmail}</p>
            <p className="text-sm">Student: {r.studentDomain}</p>
            <p className="text-sm">Faculty: {r.facultyDomain}</p>
            {r.status === "pending" ? (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => updateStatus(r.id, "approved")}
                  aria-label="Approve"
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  ✔
                </button>
                <button
                  onClick={() => updateStatus(r.id, "declined")}
                  aria-label="Decline"
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  ✖
                </button>
                <a
                  href={`mailto:${r.adminEmail}`}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Message
                </a>
              </div>
            ) : (
              <p className="mt-2">Status: {r.status}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}