// File: src/components/CreateClubModal.tsx

"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import CreateClubForm from './CreateClubForm'
import type { ClubRecord } from '@/lib/types'

interface CreateClubModalProps {
  open: boolean
  onClose: () => void
  onCreated: (club: ClubRecord) => void
}

/**
 * Modal wrapper around the {@link CreateClubForm}. Presents an overlay and
 * form for adding a new club. When a club is created the parent is
 * notified and the modal is closed automatically.
 */
export default function CreateClubModal({ open, onClose, onCreated }: CreateClubModalProps) {
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
                <CreateClubForm
                  onCreated={(club) => {
                    onCreated(club)
                    onClose()
                  }}
                  onClose={onClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}