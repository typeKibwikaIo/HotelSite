import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { adminLogout } from "../actions";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/content/settings", label: "Website Content" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-mist/40 flex">
      <aside className="w-60 bg-bluegrey-deep text-white/80 flex flex-col shrink-0 max-md:hidden">
        <div className="p-6 border-b border-white/10">
          <p className="font-display text-xl text-white">Admin</p>
          <p className="text-xs text-white/50 mt-1">{user.name} · {user.role.replace("_", " ")}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
          <Link href="/" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors">
            View Website ↗
          </Link>
        </nav>
        <form action={adminLogout} className="p-4 border-t border-white/10">
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors">
            Sign Out
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-mist px-6 py-4 flex items-center justify-between md:hidden">
          <p className="font-display text-lg">Admin</p>
          <form action={adminLogout}><button className="text-sm text-peach-dark">Sign out</button></form>
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
