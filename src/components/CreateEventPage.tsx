"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { GoogleMap, Marker, Autocomplete, useLoadScript } from "@react-google-maps/api"
import { rrulestr, RRule, Weekday } from "rrule"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

// Domain constants. In a production system these would come from the server.
const CATEGORIES = ["Social", "Academic", "Sports", "Cultural", "Other"] as const
const CLUBS      = ["Chess Club", "Math Club", "Coding Club"] as const
const GROUPS     = ["Group A", "Group B", "Group C"] as const
const WEEK_DAYS  = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const
const LS_KEY     = "createEventDraft"

// Extend the form values interface to include recurrence options and visibility
// helpers. The weekDays array stores the selected days of the week for
// weekly recurrences (Monday = 0 through Sunday = 6). monthInterval allows
// users to choose the interval for monthly recurrences (e.g., every 2 months).
// selectedClub and selectedGroup are now always present; they will only be
// required when the corresponding visibility is chosen.
interface FormValues {
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
  recurrence: "none" | "daily" | "weekly" | "monthly"
  weekDays: string[]
  monthInterval: number
}

export default function ImprovedCreateEventPage() {
  // Load Google Maps scripts
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"]
  })

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [step, setStep] = useState(1)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Initialize React Hook Form. Provide sensible defaults for new fields.
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
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
      weekDays: [],
      monthInterval: 1,
    },
  })

  // Persist intermediate form state to local storage
  const watched = useWatch({ control })
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(watched))
  }, [watched])

  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) reset(JSON.parse(saved))
  }, [reset])

  // Compute progress ratio for the stepper indicator
  const progress = (() => {
    const vals = watched as FormValues
    const required = [
      !!vals.imageFile?.[0],
      !!vals.category,
      !!vals.title,
      !!vals.description,
      vals.tags && vals.tags.length > 0,
      !!vals.start,
      !!vals.end,
    ]
    return required.filter(Boolean).length / required.length
  })()

  // Generate a static map preview of the chosen location
  const locationVal = getValues("location")
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locationVal.lat},${locationVal.lng}&zoom=17&size=600x300&markers=color:red%7C${locationVal.lat},${locationVal.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`

  // Produce an RRULE string based on recurrence inputs. For daily recurrence
  // we return FREQ=DAILY; for weekly we include BYDAY, and for monthly we
  // include the interval. When recurrence is "none" this returns undefined.
  const buildRecurrenceRule = (vals: FormValues): string | undefined => {
    switch (vals.recurrence) {
      case "daily":
        return new RRule({ freq: RRule.DAILY, dtstart: new Date(vals.start) }).toString()
      case "weekly":
        if (vals.weekDays.length === 0) return new RRule({ freq: RRule.WEEKLY, dtstart: new Date(vals.start) }).toString()
        // Convert string codes (e.g., "MO") into RRule weekday constants
        const byday = vals.weekDays.map(day => RRule[day as keyof typeof RRule] as Weekday)
        return new RRule({ freq: RRule.WEEKLY, byweekday: byday, dtstart: new Date(vals.start) }).toString()
      case "monthly":
        return new RRule({ freq: RRule.MONTHLY, interval: vals.monthInterval || 1, dtstart: new Date(vals.start) }).toString()
      default:
        return undefined
    }
  }

  // Submission handler: In a production app this would persist the event to an
  // API or database. For now, we simply log the payload and clear the draft.
  const onSubmit = (data: FormValues) => {
    const rruleString = buildRecurrenceRule(data)
    const event = { ...data, rrule: rruleString, timezone: tz }
    console.log("submit", event)
    localStorage.removeItem(LS_KEY)
    alert(`Event created:\n${JSON.stringify(event, null, 2)}`)
  }

  // Determine which fields are still missing when on the review step
  const missingRequired = (() => {
    if (step !== 4) return [] as { label: string; step: number }[]
    const v = getValues()
    const missing: { label: string; step: number }[] = []
    if (!v.imageFile?.[0]) missing.push({ label: "Image", step: 1 })
    if (!v.category) missing.push({ label: "Category", step: 1 })
    if (!v.title) missing.push({ label: "Title", step: 1 })
    if (!v.description) missing.push({ label: "Description", step: 1 })
    if (!v.tags || v.tags.length === 0) missing.push({ label: "Tags", step: 1 })
    if (!v.start) missing.push({ label: "Start", step: 3 })
    if (!v.end) missing.push({ label: "End", step: 3 })
    return missing
  })()

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading map...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-gray-100 rounded-xl shadow">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-2">Create New Event</h1>
      <p className="text-sm text-gray-600 mb-4">Step {step} of 4</p>
      {/* Stepper indicator */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className={`w-4 h-4 rounded-full ${step === i ? "bg-blue-600" : "bg-gray-300"}`}
            aria-label={`Go to step ${i}`}
          />
        ))}
      </div>

      {/* Step 1: Basic details */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Image uploader */}
          <div>
            <label className="block text-sm">Event Image</label>
            <Controller
              name="imageFile"
              control={control}
              rules={{ validate: (v) => v?.[0] !== undefined }}
              render={({ field }) => (
                <>
                  {field.value?.[0] ? (
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(field.value[0])}
                        alt="Preview"
                        className="h-32 w-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                        className="hidden"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="cursor-pointer text-blue-600">Click or drag to upload</label>
                    </div>
                  )}
                </>
              )}
            />
            {errors.imageFile && <p className="text-red-500 text-xs">Required</p>}
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm">Category</label>
            <select {...register("category", { required: true })} className="w-full border rounded p-2">
              <option value="">Select one…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs">Required</p>}
          </div>
          {/* Title */}
          <div>
            <label className="block text-sm">Title</label>
            <input {...register("title", { required: true })} className="w-full border rounded p-2" />
            {errors.title && <p className="text-red-500 text-xs">Required</p>}
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm">Description</label>
            <textarea {...register("description", { required: true })} className="w-full border rounded p-2" />
            {errors.description && <p className="text-red-500 text-xs">Required</p>}
          </div>
          {/* Tags */}
          <div>
            <label className="block text-sm">Tags</label>
            <Controller
              name="tags"
              control={control}
              rules={{ validate: (v) => v.length > 0 }}
              render={({ field }) => {
                const [input, setInput] = useState("")
                const addTag = () => {
                  const t = input.trim()
                  if (t && !field.value.includes(t)) field.onChange([...field.value, t])
                  setInput("")
                }
                return (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), addTag()) : null)}
                        className="flex-1 border rounded p-2"
                        placeholder="Add a tag"
                      />
                      <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 rounded">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 bg-blue-100 rounded-full px-2 py-1 text-xs">
                          {tag}
                          <button type="button" onClick={() => field.onChange(field.value.filter((t) => t !== tag))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                )
              }}
            />
            {errors.tags && <p className="text-red-500 text-xs">Required</p>}
          </div>
          {/* Visibility and conditional club/group selectors */}
          <div>
            <label className="block text-sm">Visibility</label>
            <select {...register("visibility")} className="w-full border rounded p-2">
              <option value="Everyone">Everyone</option>
              <option value="Club">Club</option>
              <option value="Group">Group</option>
            </select>
            {/* Show club selector when visibility is Club */}
            {watched.visibility === "Club" && (
              <div className="mt-2">
                <label className="block text-sm">Select Club</label>
                <select {...register("selectedClub", { required: true })} className="w-full border rounded p-2">
                  <option value="">Choose a club…</option>
                  {CLUBS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.selectedClub && <p className="text-red-500 text-xs">Required for club visibility</p>}
              </div>
            )}
            {/* Show group selector when visibility is Group */}
            {watched.visibility === "Group" && (
              <div className="mt-2">
                <label className="block text-sm">Select Group</label>
                <select {...register("selectedGroup", { required: true })} className="w-full border rounded p-2">
                  <option value="">Choose a group…</option>
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.selectedGroup && <p className="text-red-500 text-xs">Required for group visibility</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-6">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                <label className="block text-sm">Search address</label>
                <Autocomplete
                  onLoad={(ref) => (autocompleteRef.current = ref)}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current!.getPlace()
                    if (place.geometry?.location) {
                      field.onChange({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
                    }
                  }}
                >
                  <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Type to search…" />
                </Autocomplete>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "240px" }}
                  center={field.value}
                  zoom={17}
                  onClick={(e) => field.onChange({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                >
                  <Marker
                    position={field.value}
                    draggable
                    onDragEnd={(e) => field.onChange({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                  />
                </GoogleMap>
              </>
            )}
          />
        </div>
      )}

      {/* Step 3: Timing and recurrence */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Start</label>
            <input
              type="datetime-local"
              {...register("start", { required: true })}
              className="w-full border rounded p-2"
            />
            {errors.start && <p className="text-red-500 text-xs">Required</p>}
          </div>
          <div>
            <label className="block text-sm">End</label>
            <input
              type="datetime-local"
              {...register("end", { required: true, validate: (v) => v > getValues("start") })}
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
          {/* Weekly recurrence: allow day‑of‑week selection */}
          {watched.recurrence === "weekly" && (
            <div>
              <label className="block text-sm mb-1">Repeat on</label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((code) => {
                  const checked = watched.weekDays.includes(code)
                  return (
                    <label key={code} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const list = watched.weekDays
                          if (e.target.checked) setValue("weekDays", [...list, code])
                          else setValue("weekDays", list.filter((d) => d !== code))
                        }}
                      />
                      {code}
                    </label>
                  )
                })}
              </div>
            </div>
          )}
          {/* Monthly recurrence: interval input */}
          {watched.recurrence === "monthly" && (
            <div>
              <label className="block text-sm">Repeat every</label>
              <input
                type="number"
                min={1}
                {...register("monthInterval", { valueAsNumber: true, min: 1 })}
                className="w-full border rounded p-2"
              />
              <span className="text-sm ml-1">month(s)</span>
            </div>
          )}
          <div>
            <label className="block text-sm">Time Zone</label>
            <input value={tz} disabled className="w-full border rounded p-2 bg-gray-100" />
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Review</h2>
          {missingRequired.length > 0 && (
            <div className="bg-red-100 p-3 rounded">
              <p className="text-red-700 font-medium mb-2">Please complete the following fields:</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {missingRequired.map((m) => (
                  <li key={m.label}>
                    <button type="button" className="underline" onClick={() => setStep(m.step)}>
                      {m.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <img src={staticMapUrl} alt="Location preview" className="w-full rounded" />
          {/* Structured event summary */}
          <div className="bg-gray-50 p-4 rounded text-sm">
            <p><strong>Title:</strong> {getValues("title")}</p>
            <p><strong>Category:</strong> {getValues("category")}</p>
            <p><strong>Description:</strong> {getValues("description")}</p>
            <p><strong>Tags:</strong> {getValues("tags").join(", ")}</p>
            <p><strong>Visibility:</strong> {getValues("visibility")}</p>
            {getValues("visibility") === "Club" && <p><strong>Club:</strong> {getValues("selectedClub")}</p>}
            {getValues("visibility") === "Group" && <p><strong>Group:</strong> {getValues("selectedGroup")}</p>}
            <p>
              <strong>When:</strong> {new Date(getValues("start")).toLocaleString()} – {new Date(getValues("end")).toLocaleString()} {tz}
            </p>
            {getValues("recurrence") !== "none" && (
              <p>
                <strong>Recurrence:</strong> {getValues("recurrence")} {getValues("recurrence") === "weekly" && getValues("weekDays").length > 0 && `(on ${getValues("weekDays").join(", ")})`}{getValues("recurrence") === "monthly" && ` (every ${getValues("monthInterval")} month(s))`}
              </p>
            )}
            {/* Display the RRULE string for power users */}
            {(() => {
              const rrule = buildRecurrenceRule(getValues() as FormValues)
              return rrule ? <p className="text-xs text-gray-500">RRULE: {rrule}</p> : null
            })()}
          </div>
        </div>
      )}

      {/* Footer: navigation */}
      <div className="flex items-center mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft className="inline w-4 h-4" /> Back
        </button>
        <div className="flex-1 text-center" />
        <button
          type={step < 4 ? "button" : "submit"}
          onClick={step < 4 ? () => setStep((s) => Math.min(s + 1, 4)) : undefined}
          disabled={!isValid && step < 4}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {step < 4 ? (
            <>
              Next <ChevronRight className="inline w-4 h-4" />
            </>
          ) : (
            "Finish"
          )}
        </button>
      </div>
    </form>
  )
}