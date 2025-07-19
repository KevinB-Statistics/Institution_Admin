// File: src/components/EditEventModal.tsx

"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import EditEventForm from './EditEventForm'
import type { EventRecord } from '@/lib/types'

interface EditEventModalProps {
  /** The event to edit. When null the modal is hidden. */
  event: EventRecord | null
  /** Whether the modal is open */
  open: boolean
  /** Called when the user requests to close the modal */
  onClose: () => void
  /** Called after a successful save with the updated event */
  onSaved: (e: EventRecord) => void
}

/**
 * A modal wrapper around the {@link EditEventForm}. Uses Headless UI
 * transitions for accessibility and animation. The form is only rendered
 * when an event is supplied. On successful save, the `onSaved` callback
 * is invoked and the modal is closed.
 */
export default function EditEventModal({ event, open, onClose, onSaved }: EditEventModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {event && (
                  <EditEventForm
                    event={event}
                    onSaved={(e) => {
                      onSaved(e)
                      onClose()
                    }}
                    onClose={onClose}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}