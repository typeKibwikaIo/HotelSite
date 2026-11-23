import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ContentTabs } from "@/components/admin/ContentTabs";


export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [s, sp] = await Promise.all([
    prisma.websiteSetting.findUnique({ where: { id: "settings" } }),
    searchParams,
  ]);

  return (
    <div className="max-w-3xl">
      <ContentTabs active="settings" />
      <h1 className="font-display text-3xl">Website Settings</h1>
      {sp.saved && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-4">Settings saved.</p>}
      <div className="mt-6">
        <SettingsForm s={JSON.parse(JSON.stringify(s ?? {}))} />
      </div>
    </div>
  );
}
