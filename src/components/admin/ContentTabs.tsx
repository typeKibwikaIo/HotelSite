import Link from "next/link";

export function ContentTabs({ active }: { active: string }) {
  const tabs = [
    ["settings", "Settings"],
    ["facilities", "Facilities"],
    ["gallery", "Gallery"],
    ["testimonials", "Testimonials"],
  ];
  return (
    <div className="flex gap-2 mb-6 text-sm flex-wrap">
      {tabs.map(([slug, label]) => (
        <Link
          key={slug}
          href={`/admin/content/${slug}`}
          className={`px-4 py-2 rounded-full border transition-colors ${active === slug ? "bg-ink text-white border-ink" : "border-mist text-ink-soft hover:border-peach-dark"}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
