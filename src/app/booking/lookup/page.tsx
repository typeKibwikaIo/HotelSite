import { prisma } from "@/lib/db";
import type { Reservation, ReservationRoom, RoomCategory } from "@prisma/client";
import { formatDate, formatMoney } from "@/lib/utils";
import Link from "next/link";


export default async function BookingLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string }>;
}) {
  const sp = await searchParams;
  let reservation: (Reservation & { rooms: (ReservationRoom & { category: RoomCategory })[] }) | null = null;
  let error = "";

  if (sp.ref && sp.email) {
    const found = await prisma.reservation.findFirst({
      where: { reference: sp.ref.toUpperCase() },
      include: { rooms: { include: { category: true } } },
    });
    reservation =
      found && found.guestEmail.toLowerCase() === sp.email.toLowerCase() ? found : null;
    if (!reservation) error = "No reservation found for that reference and email.";
  } else if (sp.ref || sp.email) {
    error = "Please provide both your booking reference and email address.";
  }

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">My Bookings</p>
        <h1 className="font-display text-4xl text-center">Find Your Reservation</h1>
        <p className="text-ink-soft text-center mt-3">Enter your booking reference and the email used at reservation.</p>

        <form className="mt-8 bg-white rounded-2xl border border-mist/70 p-6 flex flex-col sm:flex-row gap-4" method="get" action="/booking/lookup">
          <input name="ref" placeholder="Booking reference (e.g. GRZ-ABC123)" defaultValue={sp.ref ?? ""} className="flex-1 text-sm border border-mist rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-peach" />
          <input name="email" type="email" placeholder="Email address" defaultValue={sp.email ?? ""} className="flex-1 text-sm border border-mist rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-peach" />
          <button className="bg-peach hover:bg-peach-dark text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors">Search</button>
        </form>

        {error && <p className="mt-6 text-center text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

        {reservation && (
          <div className="mt-8 bg-white rounded-2xl border border-mist/70 p-7">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <p className="font-mono font-bold text-lg tracking-widest text-peach-dark">{reservation.reference}</p>
                <p className="text-sm text-ink-soft mt-1">
                  {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)} · {reservation.roomsCount} room(s) · {reservation.adults} adults{reservation.children ? `, ${reservation.children} children` : ""}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                reservation.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
                reservation.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                "bg-amber-100 text-amber-800"
              }`}>
                {reservation.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              {reservation.rooms.map((r) => (
                <div key={r.id} className="flex justify-between">
                  <span>{r.category.name} × {r.quantity}</span>
                  <span>{formatMoney(r.lineTotal)}</span>
                </div>
              ))}
              <div className="border-t border-mist pt-3 flex justify-between font-semibold">
                <span>Total</span><span className="text-peach-dark">{formatMoney(reservation.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-ink-soft"><span>Payment</span><span>{reservation.paymentStatus.replace("_", " ")} · Pay at hotel</span></div>
            </div>
            {reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED" && (
              <p className="text-xs text-ink-soft mt-5">To cancel or modify this booking, please contact the hotel directly.</p>
            )}
          </div>
        )}

        <p className="text-center mt-8 text-sm">
          <Link href="/rooms" className="text-peach-dark hover:underline">← Back to rooms</Link>
        </p>
      </div>
    </div>
  );
}
