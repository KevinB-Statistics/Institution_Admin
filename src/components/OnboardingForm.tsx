// File: src/components/OnboardingForm.tsx

"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRecord } from '@/lib/types'

/**
 * A client‑side onboarding form for institution administrators. The form
 * collects basic account information (institution name, admin name,
 * email and password) and persists it via the `/api/users` endpoint.
 * Once created, the user record is stored in `localStorage` so that
 * subsequent visits skip the form and show a welcome screen. Admins
 * may log out to clear the session.
 */
export default function OnboardingForm() {
  const router = useRouter()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    institution: '',
    name: '',
    email: '',
    password: '',
  })

  // On mount, check if a user is already stored in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        setUser(JSON.parse(stored) as UserRecord)
      }
    } catch (err) {
      console.warn('Failed to load currentUser from localStorage:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle input field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Submit the onboarding form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        console.error('Failed to create user:', await res.text())
        return
      }
      const newUser: UserRecord = await res.json()
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      setUser(newUser)
      // Redirect to an admin landing page. You can change this path
      // to suit your application's routing structure.
      if (typeof router.push === 'function') router.push('/admin/clubs')
    } finally {
      setSubmitting(false)
    }
  }

  // Log out by clearing localStorage
  function handleLogout() {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  if (loading) {
    return null
  }

  if (user) {
    return (
      <div className="mx-auto max-w-lg space-y-4 bg-white p-6 sm:p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">You are currently signed in as the admin for <strong>{user.institution}</strong>.</p>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold text-gray-800">Institution Admin Onboarding</h1>
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution Name</label>
        <input
          id="institution"
          name="institution"
          type="text"
          value={form.institution}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Create Account'}
        </button>
      </div>
    </form>
  )
}