import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/ContactForm";


export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const sp = await searchParams;
  const s = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">Contact</p>
        <h1 className="font-display text-4xl md:text-5xl text-center">Get in Touch</h1>
        <p className="text-ink-soft text-center mt-4 max-w-xl mx-auto">Have a question or want to plan a special occasion? We'd love to hear from you.</p>

        <div className="grid md:grid-cols-5 gap-10 mt-14">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-mist/60 p-6">
              <h2 className="font-display text-xl mb-4">Hotel Information</h2>
              <ul className="text-sm text-ink-soft space-y-3">
                <li><span className="font-semibold text-ink">Address:</span> {s?.address}</li>
                <li><span className="font-semibold text-ink">Phone:</span> {s?.phone}</li>
                <li><span className="font-semibold text-ink">Email:</span> {s?.email}</li>
              </ul>
              {s?.mapsUrl && (
                <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 bg-peach hover:bg-peach-dark text-white text-sm px-6 py-2.5 rounded-full transition-colors">
                  Get Directions
                </a>
              )}
            </div>
            {(s?.socialFacebook || s?.socialInstagram || s?.socialTwitter) && (
              <div className="bg-white rounded-2xl border border-mist/60 p-6">
                <h2 className="font-display text-xl mb-3">Follow Us</h2>
                <div className="flex gap-4 text-sm">
                  {s?.socialFacebook && <a href={s.socialFacebook} target="_blank" rel="noreferrer" className="text-peach-dark hover:underline">Facebook</a>}
                  {s?.socialInstagram && <a href={s.socialInstagram} target="_blank" rel="noreferrer" className="text-peach-dark hover:underline">Instagram</a>}
                  {s?.socialTwitter && <a href={s.socialTwitter} target="_blank" rel="noreferrer" className="text-peach-dark hover:underline">Twitter</a>}
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-3">
            {sp.sent ? (
              <div className="bg-white rounded-2xl border border-mist/60 p-8 text-center">
                <p className="font-display text-2xl">Message sent</p>
                <p className="text-ink-soft mt-2">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <ContactForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
