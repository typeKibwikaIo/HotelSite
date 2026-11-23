import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookingPanel } from "@/components/BookingPanel";
import { AMENITY_LABELS, formatMoney, formatDate, parseDateParam } from "@/lib/utils";
import { availableQuantity, priceForNights } from "@/lib/availability";


export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [k: string]: string | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await prisma.roomCategory.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!category || !category.published) notFound();

  const amenities: string[] = JSON.parse(category.amenities || "[]");
  const checkIn = parseDateParam(sp.checkIn);
  const checkOut = parseDateParam(sp.checkOut);
  const hasDates = !!(checkIn && checkOut && checkOut > checkIn);

  let available: number | null = null;
  let totalForStay: number | null = null;
  if (hasDates) {
    available = await availableQuantity(category.id, checkIn!, checkOut!);
    totalForStay = priceForNights(category, checkIn!, checkOut!);
  }

  const main = category.images.find((i) => i.isMain) ?? category.images[0];
  const rest = category.images.filter((i) => i.id !== main?.id);

  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-sm text-ink-soft mb-6">
          <Link href="/" className="hover:text-peach-dark">Home</Link> /{" "}
          <Link href="/rooms" className="hover:text-peach-dark">Rooms & Suites</Link> / {category.name}
        </nav>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="overflow-hidden aspect-[16/10] bg-mist rounded-t-3xl">
              {main ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={main.url} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-bluegrey to-bluegrey-dark" />
              )}
            </div>
            {rest.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {rest.map((img) => (
                  <div key={img.id} className="overflow-hidden aspect-[4/3] bg-mist img-zoom rounded-t-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption || category.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            <h1 className="font-display text-4xl mt-10">{category.name}</h1>
            <p className="text-ink-soft mt-4 leading-relaxed text-lg">{category.description || category.shortDesc}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 bg-white rounded-2xl p-6 border border-mist/60">
              <div><p className="text-xs uppercase tracking-wide text-ink-soft">Size</p><p className="font-semibold mt-1">{category.roomSizeSqm ? `${category.roomSizeSqm} m²` : "N/A"}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-ink-soft">Bed</p><p className="font-semibold mt-1">{category.bedType}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-ink-soft">Occupancy</p><p className="font-semibold mt-1">Up to {category.maxOccupancy} guests</p></div>
              <div><p className="text-xs uppercase tracking-wide text-ink-soft">Bathrooms</p><p className="font-semibold mt-1">{category.bathrooms}</p></div>
            </div>

            {amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl mb-5">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 bg-white border border-mist/60 rounded-xl px-4 py-3 text-sm">
                      <span className="text-peach-dark">✓</span> {AMENITY_LABELS[a] ?? a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-mist/70 p-7 sticky top-28 shadow-sm">
              <p className="font-display text-3xl text-peach-dark">{formatMoney(category.pricePerNight)}<span className="text-base text-ink-soft font-body"> / night</span></p>
              {category.weekendRate && (
                <p className="text-xs text-ink-soft mt-1">Weekend rate: {formatMoney(category.weekendRate)}/night</p>
              )}
              {hasDates && totalForStay !== null && (
                <p className="text-sm text-ink-soft mt-3">
                  {checkIn && formatDate(checkIn)} → {checkOut && formatDate(checkOut)}
                  <br />Estimated stay total: <strong>{formatMoney(totalForStay)}</strong>
                  {available !== null && available <= 0 && <span className="block text-red-600 font-semibold mt-1">Sold out for these dates</span>}
                  {available !== null && available > 0 && <span className="block text-green-700 mt-1">{available} room{available > 1 ? "s" : ""} available</span>}
                </p>
              )}
              <BookingPanel
                slug={category.slug}
                maxAdults={category.maxAdults}
                maxChildren={category.maxChildren}
                maxOccupancy={category.maxOccupancy}
                checkIn={sp.checkIn}
                checkOut={sp.checkOut}
                available={available}
              />
              <p className="text-xs text-ink-soft mt-5 leading-relaxed">
                Free cancellation up to 48 hours before check-in. Pay at the hotel. No online payment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
