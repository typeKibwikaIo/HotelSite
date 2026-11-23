import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";


export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);

  const [categories, physicalRooms, reservations, recent, arrivals, inquiries] = await Promise.all([
    prisma.roomCategory.count(),
    prisma.physicalRoom.count(),
    prisma.reservation.findMany({
      where: { status: { not: "CANCELLED" } },
      include: { rooms: true },
    }),
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { rooms: { include: { category: true } } },
    }),
    prisma.reservation.findMany({
      where: { checkIn: { gte: today, lt: tomorrow }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { checkIn: "asc" },
      take: 8,
      include: { rooms: { include: { category: true } } },
    }),
    prisma.inquiry.count(),
  ]);

  const pending = reservations.filter((r) => r.status === "PENDING").length;
  const confirmed = reservations.filter((r) => r.status === "CONFIRMED").length;
  const cancelled = await prisma.reservation.count({ where: { status: "CANCELLED" } });
  const checkedIn = await prisma.physicalRoom.count({ where: { status: "OCCUPIED" } });
  const maintenance = await prisma.physicalRoom.count({ where: { status: { in: ["MAINTENANCE", "BLOCKED"] } } });
  const availableRooms = physicalRooms - maintenance;
  const revenue = reservations.filter((r) => r.status !== "CANCELLED").reduce((s, r) => s + r.totalAmount, 0);

  const cards = [
    ["Room Categories", categories],
    ["Physical Rooms", physicalRooms],
    ["Available Now", availableRooms],
    ["Occupied / Blocked", checkedIn + maintenance],
    ["Pending", pending],
    ["Confirmed", confirmed],
    ["Cancelled", cancelled],
    ["Total Bookings", reservations.length],
    ["Est. Revenue", formatMoney(revenue)],
    ["New Inquiries", inquiries],
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-sm text-ink-soft mt-1">Overview of your hotel operations.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        {cards.map(([label, value]) => (
          <div key={label as string} className="bg-white rounded-2xl border border-mist/70 p-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
            <p className="font-display text-2xl mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <section className="bg-white rounded-2xl border border-mist/70 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl">Recent Reservations</h2>
            <Link href="/admin/reservations" className="text-sm text-peach-dark hover:underline">View all</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-ink-soft border-b border-mist">
                <th className="pb-2">Ref</th><th className="pb-2">Guest</th><th className="pb-2">Dates</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-mist/50 last:border-0">
                  <td className="py-2.5 font-mono text-xs"><Link href={`/admin/reservations/${r.id}`} className="text-peach-dark hover:underline">{r.reference}</Link></td>
                  <td className="py-2.5">{r.guestFirstName} {r.guestLastName}</td>
                  <td className="py-2.5 text-ink-soft">{formatDate(r.checkIn)}</td>
                  <td className="py-2.5">{formatMoney(r.totalAmount)}</td>
                  <td className="py-2.5"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-ink-soft">No reservations yet.</td></tr>}
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl border border-mist/70 p-6">
          <h2 className="font-display text-xl mb-4">Arrivals Today</h2>
          <ul className="space-y-3 text-sm">
            {arrivals.map((r) => (
              <li key={r.id} className="flex justify-between items-center border-b border-mist/50 pb-3 last:border-0">
                <div>
                  <p className="font-medium">{r.guestFirstName} {r.guestLastName}</p>
                  <p className="text-ink-soft text-xs">{r.rooms.map((rm) => `${rm.category.name} ×${rm.quantity}`).join(", ")}</p>
                </div>
                <Link href={`/admin/reservations/${r.id}`} className="text-xs text-peach-dark hover:underline">{r.reference}</Link>
              </li>
            ))}
            {arrivals.length === 0 && <li className="text-ink-soft">No arrivals today.</li>}
          </ul>
          <div className="mt-6 pt-4 border-t border-mist">
            <Link href="/admin/rooms" className="text-sm bg-peach hover:bg-peach-dark text-white px-5 py-2.5 rounded-full transition-colors inline-block">
              + Add Room Category
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    CHECKED_OUT: "bg-mist text-ink-soft",
    COMPLETED: "bg-mist text-ink-soft",
    NO_SHOW: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls[status] ?? "bg-mist"}`}>{status.replace("_", " ")}</span>;
}
