import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookingForm } from "@/components/BookingForm";
import { availableQuantity, priceForNights } from "@/lib/availability";
import { nightsBetween, parseDateParam, formatMoney, formatDate } from "@/lib/utils";


export default async function BookPage({
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

  const checkIn = parseDateParam(sp.checkIn);
  const checkOut = parseDateParam(sp.checkOut);
  const adults = Math.max(1, parseInt(sp.adults || "1", 10));
  const children = Math.max(0, parseInt(sp.children || "0", 10));
  const rooms = Math.max(1, parseInt(sp.rooms || "1", 10));

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return (
      <div className="bg-cream min-h-screen pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl">Select your dates first</h1>
        <a href={`/rooms/${slug}`} className="inline-block mt-6 bg-peach text-white px-8 py-3 rounded-full">Choose Dates</a>
      </div>
    );
  }

  const available = await availableQuantity(category.id, checkIn, checkOut);
  const nights = nightsBetween(checkIn, checkOut);
  const total = priceForNights(category, checkIn, checkOut) * rooms;
  const main = category.images.find((i) => i.isMain) ?? category.images[0];

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3">Reservation</p>
        <h1 className="font-display text-4xl">Complete Your Booking</h1>

        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white border border-mist/70 overflow-hidden rounded-t-2xl">
              <div className="aspect-[4/3] bg-mist">
                {main && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={main.url} alt={category.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl">{category.name}</h2>
                <dl className="text-sm text-ink-soft mt-3 space-y-1">
                  <div className="flex justify-between"><dt>Check-in</dt><dd>{formatDate(checkIn)}</dd></div>
                  <div className="flex justify-between"><dt>Check-out</dt><dd>{formatDate(checkOut)}</dd></div>
                  <div className="flex justify-between"><dt>Nights</dt><dd>{nights}</dd></div>
                  <div className="flex justify-between"><dt>Guests</dt><dd>{adults} adults{children ? `, ${children} children` : ""}</dd></div>
                  <div className="flex justify-between"><dt>Rooms</dt><dd>{rooms}</dd></div>
                </dl>
                <div className="border-t border-mist mt-4 pt-4 flex justify-between font-semibold">
                  <span>Total</span><span className="text-peach-dark">{formatMoney(total)}</span>
                </div>
                <p className="text-xs text-ink-soft mt-2">Pay at the hotel · Free cancellation up to 48h</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <BookingForm
              slug={slug}
              checkIn={sp.checkIn!}
              checkOut={sp.checkOut!}
              adults={adults}
              children={children}
              rooms={rooms}
              available={available}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
