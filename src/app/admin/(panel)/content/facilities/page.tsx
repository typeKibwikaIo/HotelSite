import { prisma } from "@/lib/db";
import { FacilityForm } from "@/components/admin/ContentForms";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { deleteFacility } from "../../../actions";


export default async function FacilitiesAdminPage() {
  const facilities = await prisma.facility.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="max-w-4xl">
      <ContentTabs active="facilities" />
      <h1 className="font-display text-3xl">Facilities</h1>
      <p className="text-sm text-ink-soft mt-1 mb-6">Manage the experiences shown on the website.</p>

      <div className="space-y-4">
        {facilities.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-mist/70 p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold">{f.title} {!f.published && <span className="text-xs text-ink-soft">(unpublished)</span>}</p>
              <p className="text-sm text-ink-soft mt-1 line-clamp-2">{f.description}</p>
            </div>
            <div className="flex gap-3 text-sm shrink-0">
              <details className="relative">
                <summary className="cursor-pointer text-peach-dark hover:underline list-none">Edit</summary>
                <div className="absolute right-0 z-10 mt-2 w-[28rem] max-w-[90vw] bg-white rounded-2xl shadow-xl border border-mist p-4">
                  <FacilityForm facility={JSON.parse(JSON.stringify(f))} />
                </div>
              </details>
              <form action={deleteFacility.bind(null, f.id)}>
                <button className="text-red-600 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl mb-4">Add Facility</h2>
        <FacilityForm />
      </div>
    </div>
  );
}
