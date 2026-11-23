import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusBadge } from "../page";


export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.q) {
    where.OR = [
      { reference: { contains: sp.q.toUpperCase() } },
      { guestFirstName: { contains: sp.q } },
      { guestLastName: { contains: sp.q } },
      { guestEmail: { contains: sp.q } },
    ];
  }
  if (sp.status) where.status = sp.status;

  const reservations = await prisma.reservation.findMany({
    where,
    include: { rooms: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Reservations</h1>
      <p className="text-sm text-ink-soft mt-1">{reservations.length} shown</p>

      <form className="mt-6 flex flex-col sm:flex-row gap-3" method="get" action="/admin/reservations">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search reference, guest name or email…" className="flex-1 text-sm border border-mist rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach" />
        <select name="status" defaultValue={sp.status ?? ""} className="text-sm border border-mist rounded-lg px-3 py-2.5 bg-white">
          <option value="">All statuses</option>
          {["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT", "COMPLETED", "NO_SHOW"].map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <button className="bg-ink text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-bluegrey-deep transition-colors">Filter</button>
      </form>

      <div className="bg-white rounded-2xl border border-mist/70 mt-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="text-left text-xs uppercase text-ink-soft border-b border-mist">
              <th className="p-4">Reference</th><th className="p-4">Guest</th><th className="p-4">Room(s)</th><th className="p-4">Dates</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Payment</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-mist/50 last:border-0 hover:bg-sand/40">
                <td className="p-4"><Link href={`/admin/reservations/${r.id}`} className="font-mono text-xs text-peach-dark hover:underline">{r.reference}</Link></td>
                <td className="p-4">{r.guestFirstName} {r.guestLastName}<div className="text-xs text-ink-soft">{r.guestEmail}</div></td>
                <td className="p-4 text-xs">{r.rooms.map((rm) => `${rm.category.name} ×${rm.quantity}`).join(", ")}</td>
                <td className="p-4 text-ink-soft whitespace-nowrap">{formatDate(r.checkIn)} → {formatDate(r.checkOut)}</td>
                <td className="p-4">{formatMoney(r.totalAmount)}</td>
                <td className="p-4"><StatusBadge status={r.status} /></td>
                <td className="p-4 text-xs">{r.paymentStatus.replace("_", " ")}</td>
              </tr>
            ))}
            {reservations.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-ink-soft">No reservations found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
