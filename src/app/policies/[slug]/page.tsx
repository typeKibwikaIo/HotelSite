import Link from "next/link";

const pages: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "We respect your privacy. This policy explains what personal information we collect when you make a reservation or contact us, and how we use it.",
      "We collect your name, email address, phone number and reservation details solely to process your booking, communicate with you about your stay, and meet legal obligations.",
      "We do not sell or share your personal information with third parties except where required by law or to operate the hotel (for example, payment processing at the hotel).",
      "You may request access to, correction of, or deletion of your personal data by contacting us at the email address listed on our Contact page.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By booking through this website you agree to these terms. Reservations are subject to availability and confirmation by the hotel.",
      "Prices are quoted per night in the hotel's local currency and include applicable taxes unless stated otherwise. Additional charges (minibar, laundry, spa, etc.) are billed at checkout.",
      "Check-in is from 3:00 PM and check-out is by 11:00 AM. Guests under 18 must be accompanied by an adult.",
      "The hotel is not liable for loss or damage to personal belongings beyond what is covered by applicable law. We recommend travel insurance for valuable items.",
      "The hotel reserves the right to refuse service or cancel reservations in cases of abusive behaviour, fraud, or breach of house rules.",
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    body: [
      "Reservations may be cancelled free of charge up to 48 hours before the scheduled check-in time.",
      "Cancellations made within 48 hours of check-in, or no-shows, may be charged one night's stay.",
      "Modifications to dates or room type are subject to availability and may change the total price.",
      "To cancel, contact the hotel directly or manage your booking via the 'My Bookings' page using your booking reference and email.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return <div className="pt-40 text-center">Not found</div>;
  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl">{page.title}</h1>
        <div className="mt-8 space-y-4">
          {page.body.map((p, i) => (
            <p key={i} className="text-ink-soft leading-relaxed bg-white rounded-2xl border border-mist/60 p-6">{p}</p>
          ))}
        </div>
        <p className="text-sm mt-8 text-ink-soft">
          Questions? <Link href="/contact" className="text-peach-dark hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
