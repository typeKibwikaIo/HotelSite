import { prisma } from "@/lib/db";
import { RoomCard } from "@/components/RoomCard";
import { availabilityMap } from "@/lib/availability";
import { parseDateParam } from "@/lib/utils";
import Link from "next/link";


type SP = { [k: string]: string | string[] | undefined };

export default async function RoomsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const checkIn = parseDateParam(typeof sp.checkIn === "string" ? sp.checkIn : null);
  const checkOut = parseDateParam(typeof sp.checkOut === "string" ? sp.checkOut : null);
  const maxPrice = typeof sp.maxPrice === "string" ? parseFloat(sp.maxPrice) : null;
  const sort = typeof sp.sort === "string" ? sp.sort : "recommended";
  const validDates = checkIn && checkOut && checkOut > checkIn;

  const rooms = await prisma.roomCategory.findMany({
    where: { published: true },
    include: { images: true },
    orderBy: { pricePerNight: "asc" },
  });

  const avail = await availabilityMap(rooms.map((r) => r.id), validDates ? checkIn : null, validDates ? checkOut : null);

  let filtered = rooms.filter((r) => {
    if (validDates && (avail.get(r.id) ?? 0) <= 0) return false;
    if (maxPrice !== null && r.pricePerNight > maxPrice) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === "size") filtered = [...filtered].sort((a, b) => (b.roomSizeSqm ?? 0) - (a.roomSizeSqm ?? 0));
  if (sort === "recommended") filtered = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured) || a.pricePerNight - b.pricePerNight);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">Accommodations</p>
        <h1 className="font-display text-4xl md:text-5xl">Rooms & Suites</h1>
        <p className="text-ink-soft mt-3 max-w-2xl">
          Browse our collection of thoughtfully designed rooms and suites. Each listing represents a room category with live availability.
        </p>

        {/* Filter bar */}
        <form className="mt-8 bg-white rounded-2xl border border-mist/70 p-5 grid grid-cols-1 md:grid-cols-6 gap-4 items-end" action="/rooms" method="get">
          <label className="block text-xs font-semibold text-ink-soft uppercase min-w-0">
            Check-in
            <input type="date" name="checkIn" defaultValue={typeof sp.checkIn === "string" ? sp.checkIn : ""} className="mt-1 block w-full text-sm border border-mist rounded-lg px-3 py-2" />
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase min-w-0">
            Check-out
            <input type="date" name="checkOut" defaultValue={typeof sp.checkOut === "string" ? sp.checkOut : ""} className="mt-1 block w-full text-sm border border-mist rounded-lg px-3 py-2" />
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase min-w-0">
            Max price / night
            <input type="number" name="maxPrice" placeholder="Any" defaultValue={typeof sp.maxPrice === "string" ? sp.maxPrice : ""} className="mt-1 block w-full text-sm border border-mist rounded-lg px-3 py-2" />
          </label>
          <label className="block text-xs font-semibold text-ink-soft uppercase min-w-0">
            Sort by
            <select name="sort" defaultValue={sort} className="mt-1 block w-full text-sm border border-mist rounded-lg px-3 py-2 bg-white">
              <option value="recommended">Recommended</option>
              <option value="price-asc">Lowest price</option>
              <option value="price-desc">Highest price</option>
              <option value="size">Most spacious</option>
            </select>
          </label>
          <button className="bg-peach hover:bg-peach-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors w-full md:w-auto md:col-span-2">
            Apply Filters
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6">
          {filtered.length} room{filtered.length === 1 ? "" : "s"} found
          {validDates && ` for ${checkIn!.toDateString()} → ${checkOut!.toDateString()}`}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-10 bg-white rounded-2xl border border-mist/70 p-10 text-center">
            <p className="font-display text-2xl">No rooms match your search</p>
            <p className="text-ink-soft mt-2">Try different dates or adjust your filters.</p>
            <Link href="/rooms" className="inline-block mt-5 text-sm text-peach-dark underline">Clear filters</Link>
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((r) => (
              <RoomCard
                key={r.id}
                category={{ ...r, images: r.images }}
                available={validDates ? avail.get(r.id) ?? 0 : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
