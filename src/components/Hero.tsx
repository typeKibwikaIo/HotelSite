"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Hero({ title, subtitle, imageUrl }: { title: string; subtitle: string; imageUrl: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setCheckIn(today);
    setCheckOut(tomorrow);
  }, [today, tomorrow]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}`
    );
  }

  const inputCls =
    "bg-white/95 backdrop-blur text-ink text-sm rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-peach";

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="Hotel" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16 pt-40">
        <p className="text-peach text-sm tracking-[0.3em] uppercase mb-4">Welcome to paradise</p>
        <h1 className="font-display text-5xl md:text-7xl text-white leading-tight max-w-3xl">{title}</h1>
        <p className="text-white/85 mt-5 max-w-xl text-lg leading-relaxed">{subtitle}</p>

        <form
          onSubmit={search}
          className="mt-10 bg-white rounded-2xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
        >
          <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wide min-w-0">
            Check-in
            <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} className={`mt-1 block ${inputCls}`} required />
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wide min-w-0">
            Check-out
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className={`mt-1 block ${inputCls}`} required />
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wide min-w-0">
            Adults
            <select value={adults} onChange={(e) => setAdults(+e.target.value)} className={`mt-1 block ${inputCls}`}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wide min-w-0">
            Children
            <select value={children} onChange={(e) => setChildren(+e.target.value)} className={`mt-1 block ${inputCls}`}>
              {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wide min-w-0">
            Rooms
            <select value={rooms} onChange={(e) => setRooms(+e.target.value)} className={`mt-1 block ${inputCls}`}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button type="submit" className="bg-peach hover:bg-peach-dark text-white font-semibold text-sm py-3 rounded-lg transition-colors w-full md:w-auto md:col-span-1">
            Search Rooms
          </button>
        </form>
      </div>
    </section>
  );
}
