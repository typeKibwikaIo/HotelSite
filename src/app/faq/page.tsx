const FAQS = [
  { q: "What time is check-in and check-out?", a: "Check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability." },
  { q: "Do I need to pay online when booking?", a: "No. We offer a 'Pay at the Hotel' option. Your card details are never required. Simply settle your bill at the front desk during your stay." },
  { q: "What is the cancellation policy?", a: "Reservations can be cancelled free of charge up to 48 hours before check-in. Cancellations made within 48 hours may incur a charge of one night's stay." },
  { q: "Is breakfast included?", a: "Breakfast is included with our Executive Suite and can be added to any other room during booking or at the hotel." },
  { q: "Do you allow pets?", a: "We welcome well-behaved pets in designated pet-friendly rooms. Please contact us before arrival to arrange this." },
  { q: "Is parking available?", a: "Yes, we offer complimentary on-site parking for all guests, including EV charging points." },
  { q: "How do I find my booking later?", a: "Use the 'My Bookings' link in the navigation and enter your booking reference (e.g. GRZ-XXXXXX) and the email address used at reservation." },
];

export default function FaqPage() {
  return (
    <div className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-peach-dark text-sm tracking-[0.3em] uppercase mb-3 text-center">FAQ</p>
        <h1 className="font-display text-4xl md:text-5xl text-center">Frequently Asked Questions</h1>
        <div className="mt-12 space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="bg-white rounded-2xl border border-mist/60 p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-peach-dark group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="text-ink-soft mt-3 leading-relaxed text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
