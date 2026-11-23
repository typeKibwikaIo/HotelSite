import { RoomForm } from "@/components/admin/RoomForm";

export default function NewRoomPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl">Add Room Category</h1>
      <p className="text-sm text-ink-soft mt-1 mb-8">This room type will appear on the public website once published.</p>
      <RoomForm />
    </div>
  );
}
