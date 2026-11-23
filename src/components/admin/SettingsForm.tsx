"use client";

import { saveSettings } from "@/app/admin/actions";

const inputCls = "w-full text-sm border border-mist rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-peach";
const labelCls = "text-xs font-semibold text-ink-soft uppercase tracking-wide block mb-1";

export function SettingsForm({ s }: { s: Record<string, unknown> }) {
  const v = (k: string) => (s[k] as string) ?? "";

  return (
    <form action={saveSettings} className="bg-white rounded-2xl border border-mist/70 p-7 space-y-6">
      <h2 className="font-display text-xl">Hotel Identity & Hero</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div><label className={labelCls}>Hotel name</label><input name="hotelName" defaultValue={v("hotelName")} className={inputCls} /></div>
        <div><label className={labelCls}>Tagline</label><input name="tagline" defaultValue={v("tagline")} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Hero headline</label><input name="heroTitle" defaultValue={v("heroTitle")} className={inputCls} /></div>
      <div><label className={labelCls}>Hero subtitle</label><textarea name="heroSubtitle" rows={2} defaultValue={v("heroSubtitle")} className={inputCls} /></div>

      <h2 className="font-display text-xl pt-4">About Section</h2>
      <div><label className={labelCls}>About heading</label><input name="aboutTitle" defaultValue={v("aboutTitle")} className={inputCls} /></div>
      <div><label className={labelCls}>About text</label><textarea name="aboutText" rows={4} defaultValue={v("aboutText")} className={inputCls} /></div>

      <h2 className="font-display text-xl pt-4">Contact & Location</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div><label className={labelCls}>Address</label><input name="address" defaultValue={v("address")} className={inputCls} /></div>
        <div><label className={labelCls}>Phone</label><input name="phone" defaultValue={v("phone")} className={inputCls} /></div>
        <div><label className={labelCls}>Email</label><input name="email" type="email" defaultValue={v("email")} className={inputCls} /></div>
        <div><label className={labelCls}>Google Maps URL</label><input name="mapsUrl" defaultValue={v("mapsUrl")} className={inputCls} /></div>
        <div><label className={labelCls}>Notification email</label><input name="notificationEmail" type="email" defaultValue={v("notificationEmail")} className={inputCls} /></div>
      </div>

      <h2 className="font-display text-xl pt-4">Social Media</h2>
      <div className="grid sm:grid-cols-3 gap-5">
        <div><label className={labelCls}>Facebook</label><input name="socialFacebook" defaultValue={v("socialFacebook")} className={inputCls} /></div>
        <div><label className={labelCls}>Instagram</label><input name="socialInstagram" defaultValue={v("socialInstagram")} className={inputCls} /></div>
        <div><label className={labelCls}>Twitter/X</label><input name="socialTwitter" defaultValue={v("socialTwitter")} className={inputCls} /></div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="autoConfirm" defaultChecked={s.autoConfirm === true} className="accent-[#d68d5f] w-4 h-4" />
        Automatically confirm new reservations (unchecked = manual approval required)
      </label>

      <button className="bg-peach hover:bg-peach-dark text-white font-semibold px-8 py-3 rounded-full transition-colors">
        Save Settings
      </button>
    </form>
  );
}
