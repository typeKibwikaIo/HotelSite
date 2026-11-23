import { prisma } from "@/lib/db";
import { GalleryForm } from "@/components/admin/ContentForms";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { deleteGalleryImage } from "../../../actions";


export default async function GalleryAdminPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return (
    <div className="max-w-5xl">
      <ContentTabs active="gallery" />
      <h1 className="font-display text-3xl">Gallery</h1>
      <p className="text-sm text-ink-soft mt-1 mb-6">Photos shown in the public gallery. Featured images also appear on the homepage.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((g) => (
          <div key={g.id} className="bg-white border border-mist/70 overflow-hidden">
            <div className="aspect-[4/3] bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold truncate">{g.caption || "No caption"}</p>
              <p className="text-[10px] text-ink-soft">{g.category.replace("_", " ")}{g.featured ? " · Featured" : ""}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <details className="relative">
                  <summary className="cursor-pointer text-peach-dark">Edit</summary>
                  <div className="absolute left-0 z-10 mt-1 w-72 bg-white rounded-xl shadow-xl border border-mist p-3">
                    <GalleryForm image={JSON.parse(JSON.stringify(g))} />
                  </div>
                </details>
                <form action={deleteGalleryImage.bind(null, g.id)}>
                  <button className="text-red-600">Delete</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-sm text-ink-soft col-span-full">No images yet.</p>}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl mb-4">Add Image</h2>
        <GalleryForm />
      </div>
    </div>
  );
}
