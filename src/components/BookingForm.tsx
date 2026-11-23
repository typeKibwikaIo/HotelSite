"use client";

import { useActionState } from "react";
import { createReservation, type BookingState } from "@/app/actions/booking";
import { formatMoney } from "@/lib/utils";

export function BookingForm(props: {
  slug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  available: number;
  total: number;
}) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(createReservation, null);
  const inputCls = "w-full text-sm border border-mist rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach";
  const labelCls = "text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1";

  if (props.available < props.rooms) {
    return (
      <div className="bg-white rounded-2xl border border-mist/70 p-8 text-center">
        <p className="font-display text-2xl">Not enough rooms available</p>
        <p className="text-ink-soft mt-2">Only {Math.max(props.available, 0)} room(s) of this type are free for your dates. Try fewer rooms or different dates.</p>
        <a href={`/rooms/${props.slug}`} className="inline-block mt-5 bg-peach text-white px-6 py-2.5 rounded-full text-sm">Back to Room</a>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/70 p-7 space-y-5">
      <input type="hidden" name="slug" value={props.slug} />
      <input type="hidden" name="checkIn" value={props.checkIn} />
      <input type="hidden" name="checkOut" value={props.checkOut} />
      <input type="hidden" name="adults" value={props.adults} />
      <input type="hidden" name="children" value={props.children} />
      <input type="hidden" name="rooms" value={props.rooms} />

      <h2 className="font-display text-2xl">Guest Details</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={labelCls}>First name *</label><input name="firstName" required className={inputCls} /></div>
        <div><label className={labelCls}>Last name *</label><input name="lastName" required className={inputCls} /></div>
        <div><label className={labelCls}>Email *</label><input name="email" type="email" required className={inputCls} /></div>
        <div><label className={labelCls}>Phone</label><input name="phone" type="tel" className={inputCls} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Country of residence</label><input name="country" className={inputCls} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Special requests</label><textarea name="specialRequests" rows={3} className={inputCls} placeholder="Late arrival, dietary needs, celebrations…" /></div>
      </div>

      <div className="bg-sand/60 rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">Payment</h3>
        <label className="flex items-start gap-3 text-sm">
          <input type="radio" name="paymentMethod" value="PAY_AT_HOTEL" defaultChecked className="mt-1 accent-[#d68d5f]" />
          <span>
            <strong>Pay at the Hotel</strong>
            <span className="block text-ink-soft text-xs mt-0.5">No payment is taken now. Please settle your bill directly at the hotel during your stay. Estimated total: <strong>{formatMoney(props.total)}</strong></span>
          </span>
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-peach hover:bg-peach-dark disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        {pending ? "Reserving…" : `Confirm Reservation · ${formatMoney(props.total)}`}
      </button>
      <p className="text-xs text-ink-soft text-center">By confirming you agree to our cancellation policy. A booking reference will be emailed to you.</p>
    </form>
  );
}
