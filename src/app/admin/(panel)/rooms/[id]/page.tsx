import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RoomForm } from "@/components/admin/RoomForm";
import {
  addRoomImage, deleteRoomImage, setMainImage,
  addPhysicalRoom, updatePhysicalRoomStatus, deletePhysicalRoom,
} from "../../../actions";


const STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "BLOCKED"];

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.roomCategory.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, physicalRooms: { orderBy: { number: "asc" } } },
  });
  if (!category) notFound();

  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h1 className="font-display text-3xl">Edit: {category.name}</h1>
        <p className="text-sm text-ink-soft mt-1">
          <a href={`/rooms/${category.slug}`} target="_blank" className="text-peach-dark hover:underline">View public page ↗</a>
        </p>
      </div>

      <RoomForm category={JSON.parse(JSON.stringify(category))} />

      {/* Images */}
      <section className="bg-white rounded-2xl border border-mist/70 p-7">
        <h2 className="font-display text-2xl mb-1">Photos</h2>
        <p className="text-sm text-ink-soft mb-5">The main photo is used on cards and as the primary image. Paste image URLs (the admin can later extend this to file uploads).</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {category.images.map((img) => (
            <div key={img.id} className="relative overflow-hidden border border-mist aspect-[4/3] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
              {img.isMain && <span className="absolute top-2 left-2 bg-peach text-white text-[10px] font-bold px-2 py-1 rounded-full">MAIN</span>}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                {!img.isMain && (
                  <form action={setMainImage.bind(null, img.id, category.id)}><button className="hover:text-peach">Set main</button></form>
                )}
                <form action={deleteRoomImage.bind(null, img.id, category.id)}><button className="hover:text-red-300">Delete</button></form>
              </div>
            </div>
          ))}
          {category.images.length === 0 && <p className="text-sm text-ink-soft col-span-full">No photos yet.</p>}
        </div>
        <form action={addRoomImage.bind(null, category.id)} className="flex flex-col sm:flex-row gap-3">
          <input name="url" required placeholder="https://… image URL" className="flex-1 text-sm border border-mist rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-peach" />
          <input name="caption" placeholder="Caption (optional)" className="sm:w-56 text-sm border border-mist rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-peach" />
          <button className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-bluegrey-deep transition-colors">Add Photo</button>
        </form>
      </section>

      {/* Physical rooms */}
      <section className="bg-white rounded-2xl border border-mist/70 p-7">
        <h2 className="font-display text-2xl mb-1">Physical Rooms</h2>
        <p className="text-sm text-ink-soft mb-5">
          Individual rooms in this category. Mark rooms as Maintenance or Blocked to remove them from sellable inventory.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase text-ink-soft border-b border-mist">
                <th className="pb-2">Room #</th><th className="pb-2">Status</th><th className="pb-2">Notes</th><th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {category.physicalRooms.map((room) => (
                <tr key={room.id} className="border-b border-mist/50 last:border-0">
                  <td className="py-2.5 font-semibold">{room.number}</td>
                  <td className="py-2.5">
                    <form action={updatePhysicalRoomStatus.bind(null, room.id, category.id)} className="flex items-center gap-2">
                      <select name="status" defaultValue={room.status} className="text-xs border border-mist rounded-lg px-2 py-1.5 bg-white">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button className="text-xs text-peach-dark hover:underline">Update</button>
                    </form>
                  </td>
                  <td className="py-2.5 text-ink-soft text-xs">{room.notes}</td>
                  <td className="py-2.5 text-right">
                    <form action={deletePhysicalRoom.bind(null, room.id, category.id)}>
                      <button className="text-xs text-red-600 hover:underline">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
              {category.physicalRooms.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-ink-soft">No physical rooms added. Availability will be zero.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <form action={addPhysicalRoom.bind(null, category.id)} className="flex flex-col sm:flex-row gap-3 mt-5">
          <input name="number" required placeholder="Room number (e.g. 205)" className="sm:w-56 text-sm border border-mist rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-peach" />
          <input name="notes" placeholder="Notes (optional)" className="flex-1 text-sm border border-mist rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-peach" />
          <button className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-bluegrey-deep transition-colors">Add Room</button>
        </form>
      </section>
    </div>
  );
}
