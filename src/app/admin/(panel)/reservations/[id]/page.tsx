import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusBadge } from "../../page";
import { updateReservationStatus, updatePaymentStatus, updateReservationNotes } from "../../../actions";


const RES_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT", "COMPLETED", "NO_SHOW"];
const PAY_STATUSES = ["UNPAID", "DEPOSIT_PAID", "PARTIALLY_PAID", "PAID", "REFUNDED"];

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.reservation.findUnique({
    where: { id },
    include: { rooms: { include: { category: true, physicalRoom: true } } },
  });
  if (!r) notFound();

  const nights = Math.round((r.checkOut.getTime() - r.checkIn.getTime()) / 86400000);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl">{r.reference}</h1>
          <p className="text-sm text-ink-soft mt-1">Booked {formatDate(r.createdAt)}</p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <section className="bg-white rounded-2xl border border-mist/70 p-6 md:col-span-2">
          <h2 className="font-display text-xl mb-4">Booking Details</h2>
          <dl className="text-sm space-y-2">
            {r.rooms.map((rm) => (
              <div key={rm.id} className="flex justify-between border-b border-mist/50 pb-2">
                <span>{rm.category.name} × {rm.quantity}{rm.physicalRoom ? ` (Room ${rm.physicalRoom.number})` : ""}</span>
                <span>{formatMoney(rm.lineTotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2"><span>Total ({nights} nights)</span><span className="text-peach-dark">{formatMoney(r.totalAmount)}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Check-in</span><span>{formatDate(r.checkIn)}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Check-out</span><span>{formatDate(r.checkOut)}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Guests</span><span>{r.adults} adults{r.children ? `, ${r.children} children` : ""} · {r.roomsCount} room(s)</span></div>
            {r.specialRequests && <div className="pt-2"><span className="text-ink-soft">Special requests: </span>{r.specialRequests}</div>}
          </dl>
        </section>

        <section className="bg-white rounded-2xl border border-mist/70 p-6">
          <h2 className="font-display text-xl mb-4">Guest</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-ink-soft">Name</span><span>{r.guestFirstName} {r.guestLastName}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Email</span><span className="truncate max-w-[160px]">{r.guestEmail}</span></div>
            {r.guestPhone && <div className="flex justify-between"><span className="text-ink-soft">Phone</span><span>{r.guestPhone}</span></div>}
            {r.guestCountry && <div className="flex justify-between"><span className="text-ink-soft">Country</span><span>{r.guestCountry}</span></div>}
          </dl>
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-mist/70 p-6">
          <h2 className="font-display text-xl mb-4">Reservation Status</h2>
          <form action={updateReservationStatus.bind(null, r.id)} className="flex items-center gap-3">
            <select name="status" defaultValue={r.status} className="flex-1 text-sm border border-mist rounded-lg px-3 py-2.5 bg-white">
              {RES_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <button className="bg-peach hover:bg-peach-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">Update</button>
          </form>
          <p className="text-xs text-ink-soft mt-3">Use Checked In / Checked Out to manage the guest's stay.</p>
        </section>

        <section className="bg-white rounded-2xl border border-mist/70 p-6">
          <h2 className="font-display text-xl mb-4">Payment</h2>
          <form action={updatePaymentStatus.bind(null, r.id)} className="flex items-center gap-3">
            <select name="paymentStatus" defaultValue={r.paymentStatus} className="flex-1 text-sm border border-mist rounded-lg px-3 py-2.5 bg-white">
              {PAY_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <button className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-bluegrey-deep transition-colors">Update</button>
          </form>
          <p className="text-xs text-ink-soft mt-3">Method: Pay at the Hotel · Amount due: {formatMoney(r.totalAmount)}</p>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-mist/70 p-6">
        <h2 className="font-display text-xl mb-4">Internal Notes</h2>
        <form action={updateReservationNotes.bind(null, r.id)}>
          <textarea name="internalNotes" rows={4} defaultValue={r.internalNotes} placeholder="Staff-only notes about this booking…" className="w-full text-sm border border-mist rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-peach" />
          <button className="mt-3 bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-bluegrey-deep transition-colors">Save Notes</button>
        </form>
      </section>
    </div>
  );
}
