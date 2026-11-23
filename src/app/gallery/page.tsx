import { prisma } from "@/lib/db";
import { Lightbox } from "@/components/Lightbox";
import Link from "next/link";


const CATEGORIES = [
  { key: "ALL", label: "All" },
  { key: "EXTERIOR", label: "Exterior" },
  { key: "ROOMS", label: "Rooms" },
  { key: "SUITES", label: "Suites" },
  { key: "RESTAURANT", label: "Restaurant" },
  { key: "POOL", label: "Swimming Pool" },
  { key: "FACILITIES", label: "Facilities" },
  { key: "EVENTS", label: "Events" },
  { key: "SURROUNDINGS", label: "Surroundings" },
];

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const sp = await searchParams;
  const cat = sp.cat && CATEGORIES.some((c) => c.key === sp.cat) ? sp.cat : "ALL";
  const images = await prisma.galleryImage.findMany({
    where: cat === "ALL" ? {} : { category: cat as never },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">Gallery</p>
        <h1 className="font-display text-4xl md:text-5xl text-center">The Grand Azure in Pictures</h1>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={c.key === "ALL" ? "/gallery" : `/gallery?cat=${c.key}`}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                cat === c.key ? "bg-ink text-white border-ink" : "border-mist text-ink-soft hover:border-peach-dark hover:text-peach-dark"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="columns-2 md:columns-3 gap-4 mt-10 space-y-4">
          <Lightbox
            cellClassName="block w-full overflow-hidden cursor-zoom-in break-inside-avoid bg-mist rounded-t-xl"
            images={images.map((g) => ({ url: g.url, caption: g.caption || undefined }))}
          />
        </div>
        {images.length === 0 && <p className="text-center text-ink-soft mt-10">No photos in this category yet.</p>}
      </div>
    </div>
  );
}
