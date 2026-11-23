import Link from "next/link";
import { prisma } from "@/lib/db";


export default async function FacilitiesPage() {
  const facilities = await prisma.facility.findMany({ where: { published: true }, orderBy: { order: "asc" } });
  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">Experiences</p>
        <h1 className="font-display text-4xl md:text-5xl text-center">Facilities & Services</h1>
        <p className="text-ink-soft text-center mt-4 max-w-2xl mx-auto">Everything you need for a perfect stay, from world-class dining to serene spa treatments.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {facilities.map((f) => (
            <div key={f.id} className="bg-white rounded-t-2xl overflow-hidden shadow-sm card-hover border border-mist/60">
              <div className="h-52 bg-gradient-to-br from-bluegrey/30 to-bluegrey-dark/40 relative overflow-hidden">
                {f.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.imageUrl} alt={f.title} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl">{f.title}</h2>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/contact" className="inline-block bg-ink text-white px-8 py-3 rounded-full hover:bg-bluegrey-deep transition-colors">Enquire About Facilities</Link>
        </div>
      </div>
    </div>
  );
}
