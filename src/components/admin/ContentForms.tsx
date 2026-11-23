"use client";

import { useActionState } from "react";
import { saveFacility, saveGalleryImage, saveTestimonial } from "@/app/admin/actions";

const inputCls = "w-full text-sm border border-mist rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach";
const labelCls = "text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1";

export function FacilityForm({ facility }: { facility?: Record<string, unknown> | null }) {
  const [state, formAction, pending] = useActionState(saveFacility, null);
  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/70 p-6 space-y-4">
      {facility?.id ? <input type="hidden" name="id" value={String(facility.id)} /> : null}
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Title *</label><input name="title" required defaultValue={facility?.title as string} className={inputCls} /></div>
        <div><label className={labelCls}>Icon key</label><input name="icon" defaultValue={(facility?.icon as string) ?? "star"} className={inputCls} placeholder="pool, restaurant, bar, spa…" /></div>
      </div>
      <div><label className={labelCls}>Description</label><textarea name="description" rows={2} defaultValue={facility?.description as string} className={inputCls} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={labelCls}>Image URL</label><input name="imageUrl" defaultValue={facility?.imageUrl as string} className={inputCls} /></div>
        <div><label className={labelCls}>Order</label><input name="order" type="number" defaultValue={(facility?.order as number) ?? 0} className={inputCls} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={facility?.published !== false} className="accent-[#d68d5f] w-4 h-4" /> Published
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="bg-peach hover:bg-peach-dark disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
        {pending ? "Saving…" : facility?.id ? "Save" : "Add Facility"}
      </button>
    </form>
  );
}

const GALLERY_CATS = ["EXTERIOR", "ROOMS", "SUITES", "RESTAURANT", "POOL", "FACILITIES", "EVENTS", "SURROUNDINGS"];

export function GalleryForm({ image }: { image?: Record<string, unknown> | null }) {
  const [state, formAction, pending] = useActionState(saveGalleryImage, null);
  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/70 p-6 space-y-4">
      {image?.id ? <input type="hidden" name="id" value={String(image.id)} /> : null}
      <div><label className={labelCls}>Image URL *</label><input name="url" required defaultValue={image?.url as string} className={inputCls} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={labelCls}>Caption</label><input name="caption" defaultValue={image?.caption as string} className={inputCls} /></div>
        <div>
          <label className={labelCls}>Category</label>
          <select name="category" defaultValue={(image?.category as string) ?? "FACILITIES"} className={inputCls}>
            {GALLERY_CATS.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
          </select>
        </div>
        <div><label className={labelCls}>Order</label><input name="order" type="number" defaultValue={(image?.order as number) ?? 0} className={inputCls} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={image?.featured === true} className="accent-[#d68d5f] w-4 h-4" /> Featured on homepage
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="bg-peach hover:bg-peach-dark disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
        {pending ? "Saving…" : image?.id ? "Save" : "Add Image"}
      </button>
    </form>
  );
}

export function TestimonialForm({ testimonial }: { testimonial?: Record<string, unknown> | null }) {
  const [state, formAction, pending] = useActionState(saveTestimonial, null);
  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/70 p-6 space-y-4">
      {testimonial?.id ? <input type="hidden" name="id" value={String(testimonial.id)} /> : null}
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>Guest name *</label><input name="guestName" required defaultValue={testimonial?.guestName as string} className={inputCls} /></div>
        <div><label className={labelCls}>Rating (1-5)</label><input name="rating" type="number" min="1" max="5" defaultValue={(testimonial?.rating as number) ?? 5} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Review *</label><textarea name="review" required rows={3} defaultValue={testimonial?.review as string} className={inputCls} /></div>
      <div><label className={labelCls}>Guest photo URL</label><input name="guestPhoto" defaultValue={testimonial?.guestPhoto as string} className={inputCls} /></div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published !== false} className="accent-[#d68d5f] w-4 h-4" /> Published
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="bg-peach hover:bg-peach-dark disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
        {pending ? "Saving…" : testimonial?.id ? "Save" : "Add Testimonial"}
      </button>
    </form>
  );
}
