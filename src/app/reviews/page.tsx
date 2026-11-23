import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";


export default async function ReviewsPage() {
  const testimonials = await prisma.testimonial.findMany({ where: { published: true }, orderBy: { date: "desc" } });
  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">Reviews</p>
        <h1 className="font-display text-4xl md:text-5xl text-center">Guest Stories</h1>
        <div className="mt-12 space-y-6">
          {testimonials.map((t) => (
            <figure key={t.id} className="bg-white rounded-2xl border border-mist/60 p-7 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-bluegrey/30 flex items-center justify-center font-display text-xl text-bluegrey-deep shrink-0">
                {t.guestName.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <div className="text-peach text-sm tracking-widest">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                <blockquote className="text-ink-soft mt-2 leading-relaxed">“{t.review}”</blockquote>
                <figcaption className="mt-3 text-sm"><span className="font-semibold">{t.guestName}</span> <span className="text-ink-soft">· {formatDate(t.date)}</span></figcaption>
              </div>
            </figure>
          ))}
          {testimonials.length === 0 && <p className="text-center text-ink-soft">No reviews yet. Be the first to stay with us.</p>}
        </div>
      </div>
    </div>
  );
}
