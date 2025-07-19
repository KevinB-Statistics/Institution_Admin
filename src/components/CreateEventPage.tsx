// File: src/components/CreateEventPage.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { GoogleMap, Marker, Autocomplete, useLoadScript} from "@react-google-maps/api"
import { rrulestr, RRule } from "rrule"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const CATEGORIES = ["Social","Academic","Sports","Cultural","Other"] as const
const CLUBS = ["Chess Club","Math Club","Coding Club"]
const GROUPS = ["Group A","Group B","Group C"]
const LS_KEY = "createEventDraft"

type FormValues = {
  imageFile: FileList
  category: string
  title: string
  description: string
  tags: string[]
  location: { lat: number; lng: number }
  visibility: "Everyone" | "Club" | "Group"
  selectedClub: string
  selectedGroup: string
  start: string
  end: string
  recurrence: "none"|"daily"|"weekly"|"monthly"
}

export default function CreateEventPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })
  const autocompleteRef = useRef<google.maps.places.Autocomplete|null>(null)
  const [step, setStep] = useState(1)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  // React Hook Form setup
  const { register, handleSubmit, control, setValue, getValues, reset, formState: { errors, isValid } } =
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: {
        category: "",
        title: "",
        description: "",
        tags: [],
        location: { lat: 43.65362, lng: -116.67693 },
        visibility: "Everyone",
        selectedClub: "",
        selectedGroup: "",
        start: "",
        end: "",
        recurrence: "none",
      }
    })

  // Persist to localStorage on any change
  const watched = useWatch({ control })
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(watched))
  }, [watched])

  // Rehydrate on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) reset(JSON.parse(saved))
  }, [reset])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded)  return <div>Loading map...</div>

  const onNext = () => setStep(s => Math.min(s+1,4))
  const onPrev = () => setStep(s => Math.max(s-1,1))

  return (
    <form onSubmit={handleSubmit(data => console.log("submit",data))} className="p-4 bg-gray-100 rounded-xl shadow">
      {/* header */}
      <h1 className="text-2xl font-semibold text-center">Create New Event</h1>
      <p className="text-center text-sm mb-4">Step {step}/4</p>

      {/* Stepper (clickable) */}
      <div className="flex justify-center space-x-3 mb-6">
        {[1,2,3,4].map(i => (
          <button key={i} type="button"
            onClick={() => setStep(i)}
            className={`w-4 h-4 rounded-full ${step===i ? "bg-blue-600" : "bg-gray-300"}`}
            aria-label={`Go to step ${i}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-12 gap-4">
          {/* Image */}
          <div className="col-span-5 space-y-2">
            <label className="text-sm font-medium">Event Image</label>
            <div className="relative aspect-video border-2 border-dashed p-2 rounded-lg">
              <Controller
                name="imageFile"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    {field.value?.[0] ? (
                      <>
                        <img
                          src={URL.createObjectURL(field.value[0])}
                          className="object-cover w-full h-full rounded"
                        />
                        <button onClick={() => field.onChange(null)} type="button" className="absolute top-2 right-2">
                          <X />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Click or drag to upload
                      </div>
                    )}
                    <input
                      type="file" accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => field.onChange(e.target.files)}
                    />
                  </>
                )}
              />
              {errors.imageFile && <p className="text-red-500 text-xs">Required</p>}
            </div>
          </div>

          {/* Text inputs */}
          <div className="col-span-7 space-y-4">
            <div>
              <label className="block text-sm">Category</label>
              <select {...register("category",{required:true})} className="w-full border rounded p-2">
                <option value="">Select one…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs">Required</p>}
            </div>
            <div>
              <label className="block text-sm">Title</label>
              <input {...register("title",{required:true})} className="w-full border rounded p-2"/>
              {errors.title && <p className="text-red-500 text-xs">Required</p>}
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea {...register("description",{required:true})} className="w-full border rounded p-2 h-24"/>
              {errors.description && <p className="text-red-500 text-xs">Required</p>}
            </div>
            <div>
              <label className="block text-sm">Tags</label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => {
                  const [input, setInput] = useState("")
                  const add = () => {
                    const t = input.trim()
                    if(t && !field.value.includes(t)) field.onChange([...field.value,t])
                    setInput("")
                  }
                  return (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={input}
                          onChange={e=>setInput(e.target.value)}
                          onKeyDown={e=>e.key==="Enter"? (e.preventDefault(),add()):null}
                          className="flex-1 border rounded p-2"
                          placeholder="Add a tag"
                        />
                        <button type="button" onClick={add} className="px-4 py-2 bg-gray-200 rounded">
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map(tag => (
                          <span key={tag} className="flex items-center gap-1 bg-blue-100 rounded-full px-2 py-1 text-xs">
                            {tag}
                            <button onClick={()=>field.onChange(field.value.filter(t=>t!==tag))}>
                              <X className="w-3 h-3"/>
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  )
                }}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Autocomplete Input */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                <label className="block text-sm">Search address</label>
                <Autocomplete
                  onLoad={ref => (autocompleteRef.current = ref)}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current!.getPlace()
                    if (place.geometry?.location) {
                      field.onChange({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                      })
                    }
                  }}
                >
                  <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Type to search…" />
                </Autocomplete>
                <GoogleMap
                  mapContainerStyle={{ width:"100%",height:"240px" }}
                  center={field.value}
                  zoom={17}
                  onClick={e=> field.onChange({lat:e.latLng!.lat(),lng:e.latLng!.lng()})}
                >
                  <Marker
                    position={field.value}
                    draggable
                    onDragEnd={e=> field.onChange({lat:e.latLng!.lat(),lng:e.latLng!.lng()})}
                  />
                </GoogleMap>
              </>
            )}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Start</label>
            <input
              type="datetime-local"
              {...register("start",{required:true})}
              className="w-full border rounded p-2"
            />
            {errors.start && <p className="text-red-500 text-xs">Required</p>}
          </div>
          <div>
            <label className="block text-sm">End</label>
            <input
              type="datetime-local"
              {...register("end",{required:true, validate: v=> v>getValues("start") })}
              className="w-full border rounded p-2"
            />
            {errors.end && <p className="text-red-500 text-xs">End must be after start</p>}
          </div>
          <div>
            <label className="block text-sm">Recurrence</label>
            <select {...register("recurrence")} className="w-full border rounded p-2">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Time Zone</label>
            <input value={tz} disabled className="w-full border rounded p-2 bg-gray-100" />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Review</h2>
          <pre className="bg-gray-50 p-4 rounded text-xs">{JSON.stringify(getValues(),null,2)}</pre>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center mt-6">
        <button type="button" onClick={onPrev} disabled={step===1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft className="inline w-4 h-4"/> Back
        </button>
        <div className="flex-1 text-center">{/* spacer */}</div>
        <button
          type={step<4?"button":"submit"}
          onClick={step<4?onNext:undefined}
          disabled={!isValid && step<4}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {step<4 ? <>Next <ChevronRight className="inline w-4 h-4"/></> : "Finish"}
        </button>
      </div>
    </form>
  )
}
