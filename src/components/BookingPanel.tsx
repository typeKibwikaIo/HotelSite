"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BookingPanel({
  slug,
  maxAdults,
  maxChildren,
  maxOccupancy,
  checkIn,
  checkOut,
  available,
}: {
  slug: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  checkIn?: string;
  checkOut?: string;
  available: number | null;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [ci, setCi] = useState(checkIn || today);
  const [co, setCo] = useState(checkOut || tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const router = useRouter();

  const soldOut = available !== null && available <= 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/book/${slug}?checkIn=${ci}&checkOut=${co}&adults=${adults}&children=${children}&rooms=${rooms}`);
  }

  const inputCls = "mt-1 w-full text-sm border border-mist rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach";
  const labelCls = "text-xs font-semibold text-ink-soft uppercase tracking-wide block";

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className={labelCls}>Check-in
          <input type="date" value={ci} min={today} onChange={(e) => setCi(e.target.value)} className={inputCls} required />
        </label>
        <label className={labelCls}>Check-out
          <input type="date" value={co} min={ci || today} onChange={(e) => setCo(e.target.value)} className={inputCls} required />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className={labelCls}>Adults
          <select value={adults} onChange={(e) => setAdults(+e.target.value)} className={inputCls}>
            {Array.from({ length: maxAdults }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className={labelCls}>Children
          <select value={children} onChange={(e) => setChildren(+e.target.value)} className={inputCls}>
            {Array.from({ length: maxChildren + 1 }, (_, i) => i).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className={labelCls}>Rooms
          <select value={rooms} onChange={(e) => setRooms(+e.target.value)} className={inputCls}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      {soldOut && <p className="text-sm text-red-600 font-medium">This room type is fully booked for the selected dates.</p>}
      <button
        type="submit"
        disabled={soldOut || !ci || !co || ci >= co}
        className="w-full bg-peach hover:bg-peach-dark disabled:bg-mist disabled:text-ink-soft text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        Check Availability & Book
      </button>
      <p className="text-xs text-ink-soft text-center">Max {maxOccupancy} guests per room · Pay at hotel</p>
    </form>
  );
}
