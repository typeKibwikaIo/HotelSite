"use client";

import { useActionState } from "react";
import { saveRoomCategory } from "@/app/admin/actions";
import { AMENITY_LABELS } from "@/lib/utils";

const inputCls = "w-full text-sm border border-mist rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach";
const labelCls = "text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1";

export function RoomForm({ category }: { category?: Record<string, unknown> | null }) {
  const [state, formAction, pending] = useActionState(saveRoomCategory, null);
  const amenities: string[] = category?.amenities ? JSON.parse(String(category.amenities)) : [];

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/70 p-7 space-y-6">
      {category?.id ? <input type="hidden" name="id" value={String(category.id)} /> : null}

      <div className="grid sm:grid-cols-2 gap-5">
        <div><label className={labelCls}>Room name *</label><input name="name" required defaultValue={category?.name as string} className={inputCls} placeholder="e.g. Deluxe Room" /></div>
        <div><label className={labelCls}>URL slug</label><input name="slug" defaultValue={category?.slug as string} className={inputCls} placeholder="auto-generated from name" /></div>
      </div>

      <div><label className={labelCls}>Short description</label><input name="shortDesc" defaultValue={category?.shortDesc as string} className={inputCls} placeholder="One-line summary shown on cards" /></div>
      <div><label className={labelCls}>Full description</label><textarea name="description" rows={4} defaultValue={category?.description as string} className={inputCls} /></div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div><label className={labelCls}>Price / night *</label><input name="pricePerNight" type="number" step="0.01" min="0" required defaultValue={category?.pricePerNight as number} className={inputCls} /></div>
        <div><label className={labelCls}>Weekend rate</label><input name="weekendRate" type="number" step="0.01" min="0" defaultValue={category?.weekendRate as number | undefined} className={inputCls} placeholder="Optional" /></div>
        <div><label className={labelCls}>Room size (m²)</label><input name="roomSizeSqm" type="number" step="0.1" min="0" defaultValue={category?.roomSizeSqm as number | undefined} className={inputCls} /></div>
      </div>

      <div className="grid sm:grid-cols-4 gap-5">
        <div><label className={labelCls}>Max adults</label><input name="maxAdults" type="number" min="1" defaultValue={category?.maxAdults as number ?? 2} className={inputCls} /></div>
        <div><label className={labelCls}>Max children</label><input name="maxChildren" type="number" min="0" defaultValue={category?.maxChildren as number ?? 0} className={inputCls} /></div>
        <div><label className={labelCls}>Max occupancy</label><input name="maxOccupancy" type="number" min="1" defaultValue={category?.maxOccupancy as number ?? 2} className={inputCls} /></div>
        <div><label className={labelCls}>Bathrooms</label><input name="bathrooms" type="number" min="1" defaultValue={category?.bathrooms as number ?? 1} className={inputCls} /></div>
      </div>

      <div><label className={labelCls}>Bed configuration</label><input name="bedType" defaultValue={category?.bedType as string ?? "1 Queen Bed"} className={inputCls} placeholder="e.g. 1 King Bed" /></div>

      <div>
        <label className={labelCls}>Amenities (comma-separated keys)</label>
        <input name="amenities" defaultValue={amenities.join(", ")} className={inputCls} placeholder="air-conditioning, wifi, tv, minibar…" />
        <p className="text-xs text-ink-soft mt-1">Available: {Object.keys(AMENITY_LABELS).join(", ")}</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={category?.published !== false} className="accent-[#d68d5f] w-4 h-4" /> Published on website
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={category?.featured === true} className="accent-[#d68d5f] w-4 h-4" /> Featured on homepage
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{state.error}</p>}

      <button disabled={pending} className="bg-peach hover:bg-peach-dark disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full transition-colors">
        {pending ? "Saving…" : category?.id ? "Save Changes" : "Create Room Category"}
      </button>
    </form>
  );
}
