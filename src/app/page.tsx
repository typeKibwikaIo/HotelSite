import Link from "next/link";
import { prisma } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { RoomCard } from "@/components/RoomCard";
import { Lightbox } from "@/components/Lightbox";
import { formatDate } from "@/lib/utils";

const FALLBACK_HERO = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80";

const FACILITY_ICONS: Record<string, string> = {
  pool: "M2 9c.6.5 1.2 1 2.5 1C7 10 7 8 9.5 8s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2c1.3 0 1.9-.5 2.5-1M2 14c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9-.5 2.5-1",
  restaurant: "M7 3v7a3 3 0 006 0V3M10 3v18M17 3c-1.5 2-2 4-2 6h2v12",
  bar: "M5 3h14l-7 8v10",
  spa: "M12 3a9 9 0 100 18c1.5 0 2-1 2-2v-2h3a3 3 0 003-3V8a5 5 0 00-8-5zM8 12h.01M11 9h.01",
  fitness: "M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11",
  events: "M3 7h18v13H3zM8 3v4M16 3v4M3 12h18",
  wifi: "M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0M2 8.5a15 15 0 0120 0",
  garden: "M12 21v-8M12 13c0-4 3-7 8-7 0 4-3 7-8 7zM12 13c0-4-3-7-8-7 0 4 3 7 8 7z",
};

export default async function HomePage() {
  const [settings, rooms, facilities, gallery, testimonials] = await Promise.all([
    prisma.websiteSetting.findUnique({ where: { id: "settings" } }),
    prisma.roomCategory.findMany({
      where: { published: true },
      include: { images: true },
      orderBy: { pricePerNight: "asc" },
      take: 6,
    }),
    prisma.facility.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.galleryImage.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 6 }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { date: "desc" }, take: 3 }),
  ]);

  const heroImage = gallery.find(() => true);
  const aboutImage = gallery[2];
  const heroUrl = FALLBACK_HERO;

  return (
    <>
      <Hero title={settings?.heroTitle ?? "Discover Your Perfect Stay"} subtitle={settings?.heroSubtitle ?? ""} imageUrl={heroUrl} />

      {/* About */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-4">About Us</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">{settings?.aboutTitle}</h2>
            <p className="text-ink-soft mt-6 leading-relaxed">{settings?.aboutText}</p>
            <Link href="/about" className="inline-block mt-8 bg-ink text-white text-sm px-7 py-3 rounded-full hover:bg-bluegrey-deep transition-colors">
              Discover More
            </Link>
          </div>
          <div className="overflow-hidden img-zoom aspect-[4/3] bg-mist rounded-t-3xl">
            {aboutImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aboutImage.url} alt="About the hotel" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-bluegrey to-bluegrey-dark" />
            )}
          </div>
        </div>
      </section>

      {/* Rooms preview */}
      <section className="bg-bluegrey/15 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">Accommodations</p>
            <h2 className="font-display text-4xl md:text-5xl">Rooms & Suites</h2>
            <p className="text-ink-soft mt-4 max-w-2xl mx-auto">Every room is designed as a private sanctuary. Choose the space that fits your stay.</p>
          </div>
          {rooms.length === 0 ? (
            <p className="text-center text-ink-soft">Rooms are being prepared. Please check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((r) => (
                <RoomCard key={r.id} category={{ ...r, images: r.images }} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/rooms" className="inline-block border-2 border-ink text-ink hover:bg-ink hover:text-white text-sm px-8 py-3 rounded-full transition-colors">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">Experiences</p>
            <h2 className="font-display text-4xl md:text-5xl">Hotel Facilities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f) => (
              <div key={f.id} className="bg-white rounded-t-2xl overflow-hidden shadow-sm card-hover border border-mist/60">
                <div className="h-44 bg-gradient-to-br from-bluegrey/30 to-bluegrey-dark/40 relative overflow-hidden">
                  {f.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.imageUrl} alt={f.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl">{f.title}</h3>
                  <p className="text-sm text-ink-soft mt-2 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-bluegrey-deep py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-peach text-sm tracking-[0.3em] uppercase mb-3">Gallery</p>
              <h2 className="font-display text-4xl md:text-5xl text-white">Moments at {settings?.hotelName}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Lightbox
                cellClassName="relative block aspect-[4/3] overflow-hidden cursor-zoom-in bg-white/10 rounded-t-xl"
                images={gallery.map((g) => ({ url: g.url, caption: g.caption ?? undefined }))}
              />
            </div>
            <div className="text-center mt-10">
              <Link href="/gallery" className="inline-block bg-white/10 hover:bg-white/20 text-white text-sm px-7 py-3 rounded-full transition-colors">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">Reviews</p>
            <h2 className="font-display text-4xl md:text-5xl">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <figure key={t.id} className="bg-white rounded-2xl p-7 shadow-sm border border-mist/60 flex flex-col">
                <div className="text-peach text-lg tracking-widest">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                <blockquote className="text-ink-soft mt-4 leading-relaxed flex-1">“{t.review}”</blockquote>
                <figcaption className="mt-5">
                  <p className="font-semibold">{t.guestName}</p>
                  <p className="text-xs text-ink-soft">{formatDate(t.date)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-bluegrey/15 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl">Ready to Experience {settings?.hotelName}?</h2>
          <p className="text-ink-soft mt-4">{settings?.address} · {settings?.phone} · {settings?.email}</p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link href="/rooms" className="bg-peach hover:bg-peach-dark text-white px-8 py-3 rounded-full transition-colors">Book Your Stay</Link>
            <Link href="/contact" className="border border-ink/20 hover:border-peach-dark hover:text-peach-dark px-8 py-3 rounded-full transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
