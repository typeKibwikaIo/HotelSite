"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ hotelName = "The Grand Azure" }: { hotelName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Transparent/white text only works over the homepage hero; everywhere else use the solid light style.
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        solid
          ? "bg-cream/95 backdrop-blur shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className={cn("font-display text-xl tracking-wide", solid ? "text-ink" : "text-white")}>
          {hotelName}
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide transition-colors",
                solid ? "text-ink-soft hover:text-peach-dark" : "text-white/90 hover:text-peach"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/booking/lookup"
            className={cn(
              "text-sm tracking-wide",
              solid ? "text-ink-soft hover:text-peach-dark" : "text-white/90 hover:text-peach"
            )}
          >
            My Bookings
          </Link>
          <Link
            href="/rooms"
            className="bg-peach hover:bg-peach-dark text-white text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            Book Now
          </Link>
        </div>
        <button
          className={cn("lg:hidden", solid ? "text-ink" : "text-white")}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="lg:hidden bg-cream border-t border-mist px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink-soft py-1" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking/lookup" className="text-ink-soft py-1" onClick={() => setOpen(false)}>
            My Bookings
          </Link>
          <Link href="/rooms" className="bg-peach text-white text-center px-5 py-2.5 rounded-full" onClick={() => setOpen(false)}>
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
