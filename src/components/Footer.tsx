import Link from "next/link";
import { prisma } from "@/lib/db";

export async function Footer() {
  const s = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });
  return (
    <footer className="bg-bluegrey-deep text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl text-white mb-3">{s?.hotelName ?? "The Grand Azure"}</p>
          <p className="text-sm leading-relaxed">{s?.tagline ?? ""}</p>
          <div className="flex gap-4 mt-4 text-sm">
            {s?.socialFacebook && <a href={s.socialFacebook} className="hover:text-peach">Facebook</a>}
            {s?.socialInstagram && <a href={s.socialInstagram} className="hover:text-peach">Instagram</a>}
            {s?.socialTwitter && <a href={s.socialTwitter} className="hover:text-peach">Twitter</a>}
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm tracking-widest uppercase">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/rooms" className="hover:text-peach">Rooms & Suites</Link></li>
            <li><Link href="/facilities" className="hover:text-peach">Facilities</Link></li>
            <li><Link href="/gallery" className="hover:text-peach">Gallery</Link></li>
            <li><Link href="/about" className="hover:text-peach">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-peach">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm tracking-widest uppercase">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>{s?.address}</li>
            <li>{s?.phone}</li>
            <li>{s?.email}</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm tracking-widest uppercase">Policies</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/policies/privacy" className="hover:text-peach">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-peach">Terms & Conditions</Link></li>
            <li><Link href="/policies/cancellation" className="hover:text-peach">Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {s?.hotelName ?? "The Grand Azure"}. All rights reserved.
      </div>
    </footer>
  );
}
