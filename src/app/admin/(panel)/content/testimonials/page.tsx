import { prisma } from "@/lib/db";
import { TestimonialForm } from "@/components/admin/ContentForms";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { deleteTestimonial } from "../../../actions";
import { formatDate } from "@/lib/utils";


export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { date: "desc" } });
  return (
    <div className="max-w-4xl">
      <ContentTabs active="testimonials" />
      <h1 className="font-display text-3xl">Testimonials</h1>
      <p className="text-sm text-ink-soft mt-1 mb-6">Guest reviews shown on the website.</p>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-mist/70 p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold">{t.guestName} <span className="text-peach">{"★".repeat(t.rating)}</span></p>
                <p className="text-xs text-ink-soft">{formatDate(t.date)}{!t.published ? " · unpublished" : ""}</p>
                <p className="text-sm text-ink-soft mt-2">“{t.review}”</p>
              </div>
              <div className="flex gap-3 text-sm shrink-0">
                <details className="relative">
                  <summary className="cursor-pointer text-peach-dark hover:underline list-none">Edit</summary>
                  <div className="absolute right-0 z-10 mt-2 w-[28rem] max-w-[90vw] bg-white rounded-2xl shadow-xl border border-mist p-4">
                    <TestimonialForm testimonial={JSON.parse(JSON.stringify(t))} />
                  </div>
                </details>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button className="text-red-600 hover:underline">Delete</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-sm text-ink-soft">No testimonials yet.</p>}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl mb-4">Add Testimonial</h2>
        <TestimonialForm />
      </div>
    </div>
  );
}
