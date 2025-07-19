// File: src/components/EditClubModal.tsx

"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import EditClubForm from './EditClubForm'
import type { ClubRecord } from '@/lib/types'

interface EditClubModalProps {
  club: ClubRecord | null
  open: boolean
  onClose: () => void
  onSaved: (club: ClubRecord) => void
}

/**
 * Modal wrapper for editing an existing club. Displays the editing form
 * and handles closing and saving callbacks. The modal only renders its
 * contents when a club is provided.
 */
export default function EditClubModal({ club, open, onClose, onSaved }: EditClubModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                {club && (
                  <EditClubForm
                    club={club}
                    onSaved={(updated) => {
                      onSaved(updated)
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