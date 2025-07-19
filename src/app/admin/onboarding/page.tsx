// File: src/app/admin/onboarding/page.tsx

import type { Metadata } from 'next'
import OnboardingClient from './OnboardingClient'

export const metadata: Metadata = {
  title: 'Onboarding – Institution Admin',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <OnboardingClient />
    </div>
  )
}
