"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, null);
  const inputCls = "w-full text-sm border border-mist rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-peach";

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-mist/60 p-7 space-y-4">
      <h2 className="font-display text-2xl">Send a Message</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Your name" className={inputCls} />
        <input name="email" type="email" required placeholder="Email address" className={inputCls} />
      </div>
      <textarea name="message" required rows={5} placeholder="How can we help?" className={inputCls} />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="bg-peach hover:bg-peach-dark disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full transition-colors">
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
