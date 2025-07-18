"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { ChevronRight } from "lucide-react"

const CATEGORIES = [
  "Social",
  "Academic",
  "Sports",
  "Cultural",
  "Other",
] as const

type Tag = string

export default function CreateEventPage() {
  const [step, setStep] = useState<number>(1)

  // Step 1 state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [category, setCategory] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [tags, setTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState<string>("")

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput("")
  }

  const handleNext = (e?: FormEvent) => {
    e?.preventDefault()
    setStep(prev => Math.min(prev + 1, 4))
  }
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1))

  const steps = [1, 2, 3, 4]

  return (
    <div className="bg-gray-100 flex items-start justify-center pt-16 px-6 h-screen overflow-hidden">
      {/* inner container scrolls if content exceeds available height */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-auto max-h-[calc(100vh-8rem)]">
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-center">Create New Event</h1>

          {/* Progress Dots */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            {steps.map(i => (
              <div
                key={i}
                className={`transition-all rounded-full ${
                  step === i ? 'bg-blue-600 w-4 h-4' : 'bg-gray-300 w-3 h-3'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="mt-8">
            {step === 1 && (
              <form onSubmit={handleNext} className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full border rounded px-3 py-2 h-32 resize-none"
                      placeholder="Describe your event"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(t => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            )}

            {step > 1 && (
              <div className="py-20 text-center text-gray-500">
                <p className="mb-4">Step {step} content goes here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 p-4 flex justify-between">
          <button
            onClick={handlePrev}
            className={`px-6 py-2 rounded ${step === 1 ? 'invisible' : 'bg-gray-200 hover:bg-gray-300'}`}
          >Back</button>
          {step < 4 ? (
            <button
              onClick={step === 1 ? undefined : handleNext}
              form={step === 1 ? undefined : ''}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          ) : (
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Finish</button>
          )}
        </div>
      </div>
    </div>
  )
}
