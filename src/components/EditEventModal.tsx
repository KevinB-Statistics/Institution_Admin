"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import EditEventForm from "./EditEventForm";
import type { EventRecord } from "@/lib/types";

export default function EditEventModal({
  event,
  open,
  onClose,
  onSaved,
}: {
  event: EventRecord | null;
  open: boolean;
  onClose: () => void;
  onSaved: (e: EventRecord) => void;
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
              {event && <EditEventForm event={event} onSaved={onSaved} />}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}