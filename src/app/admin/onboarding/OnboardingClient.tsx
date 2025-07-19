"use client"

import OnboardingForm from '@/components/OnboardingForm'

/**
 * Client boundary for anything that uses hooks, localStorage, window, etc.
 * Simply renders your existing form component.
 */
export default function OnboardingClient() {
  return <OnboardingForm />
}