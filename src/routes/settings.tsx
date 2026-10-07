import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadOrg, saveOrg } from "@/lib/db";
import { DEFAULT_ORG, type Org } from "@/lib/org";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Company Settings | AI-HRM" },
      { name: "description", content: "Set company details, addresses and signatory used on letters and ID cards." },
      { property: "og:title", content: "Company Settings | AI-HRM" },
      { property: "og:description", content: "Company profile used across AI-HRM documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const FIELDS: { key: keyof Org; label: string }[] = [
  { key: "name", label: "Company name" },
  { key: "tagline", label: "Tagline" },
  { key: "website", label: "Website" },
  { key: "email", label: "Company email" },
  { key: "hrEmail", label: "HR email" },
  { key: "phone", label: "Phone" },
  { key: "address1", label: "Office address 1" },
  { key: "address2", label: "Office address 2" },
  { key: "gst", label: "GST" },
  { key: "cin", label: "CIN" },
  { key: "signatoryName", label: "Signatory name" },
  { key: "signatoryTitle", label: "Signatory title" },
];

function SettingsPage() {
  const [org, setOrg] = useState<Org>(DEFAULT_ORG);
  useEffect(() => {
    void loadOrg().then(setOrg);
  }, []);

  async function save() {
    try {
      await saveOrg(org);
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Company settings</h1>
        <div className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              <Input maxLength={200} value={org[f.key]} onChange={(e) => setOrg({ ...org, [f.key]: e.target.value })} />
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => void save()}>
          <Save className="mr-2 h-4 w-4" /> Save settings
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
