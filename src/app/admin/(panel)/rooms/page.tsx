import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { deleteRoomCategory } from "../../actions";


export default async function AdminRoomsPage() {
  const rooms = await prisma.roomCategory.findMany({
    include: { _count: { select: { physicalRooms: true, reservationRooms: true } }, images: { where: { isMain: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl">Room Categories</h1>
          <p className="text-sm text-ink-soft mt-1">Room types shown on the public website. Each can contain multiple physical rooms.</p>
        </div>
        <Link href="/admin/rooms/new" className="bg-peach hover:bg-peach-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          + Add Room
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-mist/70 mt-8 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs uppercase text-ink-soft border-b border-mist">
              <th className="p-4">Name</th><th className="p-4">Price/night</th><th className="p-4">Occupancy</th><th className="p-4">Physical rooms</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-b border-mist/50 last:border-0">
                <td className="p-4">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-ink-soft">/{r.slug}</p>
                </td>
                <td className="p-4">{formatMoney(r.pricePerNight)}</td>
                <td className="p-4">{r.maxOccupancy}</td>
                <td className="p-4">{r._count.physicalRooms}</td>
                <td className="p-4">
                  {r.published ? <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">Published</span>
                    : <span className="text-xs font-semibold bg-mist text-ink-soft px-2.5 py-1 rounded-full">Unpublished</span>}
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link href={`/admin/rooms/${r.id}`} className="text-peach-dark hover:underline text-xs mr-3">Edit</Link>
                  <Link href={`/rooms/${r.slug}`} target="_blank" className="text-ink-soft hover:underline text-xs mr-3">View</Link>
                  {r._count.reservationRooms === 0 && (
                    <form action={deleteRoomCategory.bind(null, r.id)} className="inline">
                      <button className="text-red-600 hover:underline text-xs">Delete</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-ink-soft">No room categories yet. Add your first room to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
