import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, Save, Sparkles, Trash2, Upload, IdCard as IdCardIcon } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { IdCardDocument } from "@/components/IdCardDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLetters, formatDate, type Letter } from "@/lib/letters";
import {
  deleteIdCard,
  emptyIdCard,
  getIdCards,
  nextEmployeeId,
  saveIdCard,
  type IdCard,
} from "@/lib/idcards";

export const Route = createFileRoute("/idcard")({
  head: () => ({
    meta: [
      { title: "AI Employee ID Card Generator | EvolveNest Energy HR Suite" },
      {
        name: "description",
        content:
          "Create branded employee ID cards from saved letter records: upload a photo, enhance it with AI, add email and mobile, and download a print-ready PDF.",
      },
      { property: "og:title", content: "Employee ID Card Generator | EvolveNest Energy" },
      {
        property: "og:description",
        content:
          "Generate employee ID cards with AI photo enhancement, reference IDs and PDF download.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdCardPage,
});

const BLOOD = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function IdCardPage() {
  const [card, setCard] = useState<IdCard>(() => emptyIdCard());
  const [letters, setLetters] = useState<Letter[]>([]);
  const [saved, setSaved] = useState<IdCard[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLetters(getLetters());
    setSaved(getIdCards());
    setCard((c) => ({ ...c, employeeId: c.employeeId || nextEmployeeId() }));
  }, []);

  const set = <K extends keyof IdCard>(key: K, value: IdCard[K]) =>
    setCard((c) => ({ ...c, [key]: value }));

  function loadFromRecord(letterId: string) {
    const l = letters.find((x) => x.letterId === letterId);
    if (!l) return;
    setCard((c) => ({
      ...c,
      letterId: l.letterId,
      name: l.name,
      position: l.position,
      department: l.department,
      employmentType: l.employmentType,
      email: l.email,
      phone: l.phone,
      location: l.location,
    }));
    toast.success(`Loaded details from ${l.letterId}`);
  }

  function onPhoto(file?: File) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Please choose an image under 8MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photo", String(reader.result));
    reader.readAsDataURL(file);
  }

  async function enhance() {
    if (!card.photo) {
      toast.error("Upload a photo first");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/enhance-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: card.photo }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { image: string };
      set("photo", data.image);
      toast.success("Photo enhanced for the ID card");
    } catch (e) {
      toast.error(`Could not enhance photo: ${e instanceof Error ? e.message.slice(0, 120) : ""}`);
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!card.name.trim()) {
      toast.error("Employee name is required");
      return;
    }
    const payload = { ...card, employeeId: card.employeeId || nextEmployeeId() };
    saveIdCard(payload);
    setCard(payload);
    setSaved(getIdCards());
    toast.success(`Saved ${payload.employeeId}`);
  }

  function download() {
    save();
    setTimeout(() => window.print(), 350);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Employee ID card</h1>
            <p className="text-sm text-muted-foreground">
              Employee ID: <strong className="text-foreground">{card.employeeId}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save}>
              <Save className="mr-2 h-4 w-4" /> Save card
            </Button>
            <Button onClick={download}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="no-print space-y-6 rounded-xl border border-border bg-card p-5">
            <div className="space-y-4">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                From letter record
              </h2>
              <Field label="Reference ID">
                <Select value={card.letterId} onValueChange={loadFromRecord}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a saved letter" />
                  </SelectTrigger>
                  <SelectContent>
                    {letters.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No saved letters yet
                      </SelectItem>
                    ) : (
                      letters.map((l) => (
                        <SelectItem key={l.id} value={l.letterId}>
                          {l.letterId} — {l.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Photo
              </h2>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload photo
                </Button>
                <Button onClick={enhance} disabled={busy}>
                  <Sparkles className="mr-2 h-4 w-4" /> {busy ? "Enhancing…" : "AI enhance"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                AI crops and cleans the photo into a studio-style ID portrait on a plain background.
              </p>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Employee details
              </h2>
              <Field label="Full name">
                <Input
                  maxLength={60}
                  value={card.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Position">
                <Input
                  maxLength={60}
                  value={card.position}
                  onChange={(e) => set("position", e.target.value)}
                />
              </Field>
              <Field label="Department">
                <Input
                  maxLength={40}
                  value={card.department}
                  onChange={(e) => set("department", e.target.value)}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  maxLength={120}
                  value={card.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label="Mobile number">
                <Input
                  maxLength={20}
                  value={card.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field label="Base location">
                <Input
                  maxLength={120}
                  value={card.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </Field>
              <Field label="Blood group">
                <Select value={card.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Emergency contact">
                <Input
                  maxLength={40}
                  value={card.emergencyContact}
                  onChange={(e) => set("emergencyContact", e.target.value)}
                />
              </Field>
              <Field label="Issue date">
                <Input
                  type="date"
                  value={card.issueDate}
                  onChange={(e) => set("issueDate", e.target.value)}
                />
              </Field>
              <Field label="Valid till">
                <Input
                  type="date"
                  value={card.validTill}
                  onChange={(e) => set("validTill", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="space-y-8">
            <IdCardDocument card={card} />

            <div className="no-print rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-primary">
                <IdCardIcon className="h-4 w-4" /> Saved cards ({saved.length})
              </h2>
              <div className="mt-4 divide-y divide-border">
                {saved.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ID cards saved yet.</p>
                ) : (
                  saved.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 py-2 text-sm">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground">{c.employeeId}</span>
                      <span className="text-xs text-muted-foreground">
                        valid till {formatDate(c.validTill)}
                      </span>
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setCard(c)}>
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            deleteIdCard(c.id);
                            setSaved(getIdCards());
                            toast.success("Card deleted");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
