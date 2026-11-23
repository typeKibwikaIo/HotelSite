"use client";

import { useActionState } from "react";
import { adminLogin } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, null);
  const inputCls = "w-full text-sm border border-mist rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-peach";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1">Email</label>
        <input name="email" type="email" required className={inputCls} placeholder="admin@hotel.com" />
      </div>
      <div>
        <label className="text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1">Password</label>
        <input name="password" type="password" required className={inputCls} />
      </div>
      {state?.error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{state.error}</p>}
      <button disabled={pending} className="w-full bg-peach hover:bg-peach-dark disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
