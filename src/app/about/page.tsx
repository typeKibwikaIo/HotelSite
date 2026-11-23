import Link from "next/link";
import { prisma } from "@/lib/db";


export default async function AboutPage() {
  const s = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });
  const stats = await Promise.all([
    prisma.roomCategory.count({ where: { published: true } }),
    prisma.physicalRoom.count(),
    prisma.facility.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
  ]);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">About Us</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">{s?.aboutTitle}</h1>
        <p className="text-lg text-ink-soft mt-6 leading-relaxed whitespace-pre-line">{s?.aboutText}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            [stats[0], "Room Categories"],
            [stats[1], "Guest Rooms"],
            [stats[2], "Facilities"],
            [stats[3], "Guest Reviews"],
          ].map(([n, label]) => (
            <div key={label as string} className="bg-white rounded-2xl border border-mist/60 p-6 text-center">
              <p className="font-display text-4xl text-peach-dark">{n}</p>
              <p className="text-xs uppercase tracking-wide text-ink-soft mt-2">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-bluegrey/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl">Plan Your Stay</h2>
            <p className="text-ink-soft mt-2">Browse our rooms and check live availability for your dates.</p>
          </div>
          <Link href="/rooms" className="bg-peach hover:bg-peach-dark text-white px-8 py-3 rounded-full transition-colors whitespace-nowrap">
            View Rooms & Suites
          </Link>
        </div>
      </div>
    </div>
  );
}
