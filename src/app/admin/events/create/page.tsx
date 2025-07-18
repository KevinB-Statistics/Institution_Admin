"use client"

import React, { useState, ChangeEvent, FormEvent } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

const CATEGORIES = [
  "Social",
  "Academic",
  "Sports",
  "Cultural",
  "Other",
] as const

const CLUBS = ["Chess Club", "Math Club", "Coding Club"]
const GROUPS = ["Group A", "Group B", "Group C"]

type Tag = string

type Location = { lat: number; lng: number }

// Specify Google Maps libraries explicitly as literal types
const MAP_LIBRARIES = ["places"] as ("places")[]
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export default function CreateEventPage() {
  // non-null assert apiKey since we require it in env
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: MAP_LIBRARIES,
  })

  const [step, setStep] = useState<number>(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [category, setCategory] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [tags, setTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const [location, setLocation] = useState<Location>({ lat: 43.65362, lng: -116.67693 })
  const [visibility, setVisibility] = useState<string>("Everyone")
  const [selectedClub, setSelectedClub] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")

  const steps = ["Basic Info", "Location", "Schedule", "Review"]

  // Handlers
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0])
  }
  const handleRemoveImage = () => setImageFile(null)
  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput("")
  }
  const handleRemoveTag = (tagToRemove: Tag) => setTags(prev => prev.filter(t => t !== tagToRemove))
  const handleNext = (e?: FormEvent) => { e?.preventDefault(); setStep(prev => Math.min(prev + 1, steps.length)) }
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1))

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading map...</div>

  return (
    <div className="bg-gray-100 flex items-start justify-center pt-16 px-6 h-[calc(100vh-5rem)] overflow-hidden">
       <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-auto max-h-[calc(100vh-9rem)]">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-1">Create New Event</h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Step {step} of {steps.length}: {steps[step - 1]}
          </p>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="grid grid-cols-12 gap-6">
              {/* Image Upload */}
              <div className="col-span-5 space-y-2">
                <label className="block text-sm font-medium">Event Image</label>
                <div className="relative w-full aspect-square border-2 rounded-lg overflow-hidden cursor-pointer border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  {imageFile ? (
                    <>
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow" aria-label="Remove image">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">Click or drag to upload</div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <p className="text-xs text-gray-500">Recommended size: 800×800px</p>
              </div>

              {/* Fields */}
              <div className="col-span-7 space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-3 py-2" required>
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter event name" required />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 h-32 resize-none" placeholder="Describe your event" required />
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Add a tag" />
                    <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(t => (
                      <span key={t} onClick={() => handleRemoveTag(t)} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs cursor-pointer hover:bg-blue-200">
                        {t}
                        <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6 p-6">
              {/* Google Map Picker */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <GoogleMap mapContainerStyle={{ width: '100%', height: '300px' }} center={location} zoom={17} onClick={e => {
                    const ll = e.latLng
                    if (ll) setLocation({ lat: ll.lat(), lng: ll.lng() })
                  }}>
                  <Marker position={location} draggable onDragEnd={e => {
                    const ll = e.latLng
                    if (ll) setLocation({ lat: ll.lat(), lng: ll.lng() })
                  }} />
                </GoogleMap>
                <p className="text-xs text-gray-500">Click or drag marker to set location.</p>
              </div>
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium mb-1">Visibility</label>
                <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option>Everyone</option><option>Club</option><option>Group</option>
                </select>
              </div>
              {visibility === 'Club' && <div><label className="block text-sm font-medium mb-1">Select Club</label><select value={selectedClub} onChange={e => setSelectedClub(e.target.value)} className="w-full border rounded px-3 py-2"><option value="" disabled>Select a club</option>{CLUBS.map(c => <option key={c}>{c}</option>)}</select></div>}
              {visibility === 'Group' && <div><label className="block text-sm font-medium mb-1">Select Group</label><select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="w-full border rounded px-3 py-2"><option value="" disabled>Select a group</option>{GROUPS.map(g => <option key={g}>{g}</option>)}</select></div>}
            </form>
          )}

          {/* Other steps placeholder */}
          {step > 2 && <div className="py-12 text-center text-gray-500"><p>{steps[step - 1]} content goes here.</p></div>}
        </div>

        {/* Footer Nav & Progress */}
        <div className="border-t p-6 flex items-center relative">
          {/* Back Button Left */}
          <div>
            <button onClick={handlePrev} disabled={step === 1} className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>

          {/* Progress Dots Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
            {steps.map((label, idx) => {
              const i = idx + 1
              const active = step === i
              return <button key={i} onClick={() => setStep(i)} className={`transition-all rounded-full focus:outline-none ${active ? 'bg-blue-600 w-5 h-5' : 'bg-gray-300 w-3 h-3'} hover:ring-2 ring-blue-400`} aria-label={`Go to step ${i}: ${label}`} />
            })}
          </div>

          {/* Next/Finish Button Right */}
          <div className="ml-auto">
            <button onClick={step < steps.length ? handleNext : undefined} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={step===1?!category||!title:false}>
              {step < steps.length ? <>Next<ChevronRight className="w-4 h-4"/></> : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
