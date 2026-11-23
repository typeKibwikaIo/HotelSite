import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";


export default async function ConfirmationPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { reference: ref },
    include: { rooms: { include: { category: true } } },
  });
  if (!reservation) notFound();

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-mist/70 p-8 md:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center text-3xl">✓</div>
          <h1 className="font-display text-4xl mt-5">Reservation {reservation.status === "CONFIRMED" ? "Confirmed" : "Received"}</h1>
          <p className="text-ink-soft mt-3">Thank you, {reservation.guestFirstName}. Your booking reference is:</p>
          <p className="font-mono text-2xl font-bold text-peach-dark mt-2 tracking-widest">{reservation.reference}</p>
          <p className="text-sm text-ink-soft mt-2">Please keep this reference; you'll need it to view or manage your booking.</p>

          <div className="mt-8 text-left bg-sand/50 rounded-2xl p-6 space-y-3 text-sm">
            {reservation.rooms.map((r) => (
              <div key={r.id} className="flex justify-between">
                <span>{r.category.name} × {r.quantity}</span>
                <span>{formatMoney(r.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t border-mist pt-3 flex justify-between font-semibold text-base">
              <span>Total ({reservation.checkOut && reservation.checkIn ? Math.round((reservation.checkOut.getTime() - reservation.checkIn.getTime()) / 86400000) : 0} nights)</span>
              <span className="text-peach-dark">{formatMoney(reservation.totalAmount)}</span>
            </div>
            <div className="flex justify-between"><span>Check-in</span><span>{formatDate(reservation.checkIn)}</span></div>
            <div className="flex justify-between"><span>Check-out</span><span>{formatDate(reservation.checkOut)}</span></div>
            <div className="flex justify-between"><span>Guests</span><span>{reservation.adults} adults{reservation.children ? `, ${reservation.children} children` : ""} · {reservation.roomsCount} room(s)</span></div>
            <div className="flex justify-between"><span>Payment</span><span>Pay at the hotel ({reservation.paymentStatus.toLowerCase().replace("_", " ")})</span></div>
          </div>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link href={`/booking/lookup?ref=${reservation.reference}&email=${encodeURIComponent(reservation.guestEmail)}`} className="bg-ink text-white px-7 py-3 rounded-full text-sm hover:bg-bluegrey-deep transition-colors">
              View My Booking
            </Link>
            <Link href="/rooms" className="border border-ink/20 px-7 py-3 rounded-full text-sm hover:border-peach-dark hover:text-peach-dark transition-colors">
              Book Another Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
