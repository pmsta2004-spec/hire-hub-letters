import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Save, RotateCcw, FileText } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { LetterDocument } from "@/components/LetterDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMPLOYMENT_TYPES,
  LETTER_TYPES,
  POSITIONS,
  emptyLetter,
  type EmploymentType,
  type Letter,
  type LetterType,
} from "@/lib/letters";
import { getLetterById, loadOrg, nextLetterId, saveLetter, updateCandidate } from "@/lib/db";
import { DEFAULT_ORG, locationOptions, type Org } from "@/lib/org";

type Search = {
  id?: string | undefined;
  candidateId?: string | undefined;
  type?: LetterType | undefined;
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  position?: string | undefined;
  employmentType?: EmploymentType | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/generate")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: str(search["id"]),
    candidateId: str(search["candidateId"]),
    type: (["offer", "joining", "appointment"] as const).includes(search["type"] as LetterType)
      ? (search["type"] as LetterType)
      : undefined,
    name: str(search["name"]),
    email: str(search["email"]),
    phone: str(search["phone"]),
    position: str(search["position"]),
    employmentType: str(search["employmentType"]) as EmploymentType | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Offer, Joining & Appointment Letters | AI-HRM" },
      {
        name: "description",
        content:
          "Fill in candidate and role details to instantly generate a company-branded offer letter, joining letter or appointment letter with PDF download.",
      },
      { property: "og:title", content: "Generate HR Letters | AI-HRM" },
      {
        property: "og:description",
        content: "Create branded offer, joining and appointment letters with unique reference IDs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneratePage,
});

function Field({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function GeneratePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [letter, setLetter] = useState<Letter>(() => emptyLetter(search.type ?? "offer"));
  const [ready, setReady] = useState(false);
  const [showTerms, setShowTerms] = useState(true);

  const [org, setOrg] = useState<Org>(DEFAULT_ORG);

  useEffect(() => {
    void (async () => {
      const o = await loadOrg();
      setOrg(o);
      const existing = search.id ? await getLetterById(search.id) : null;
      if (existing) {
        setLetter(existing);
      } else {
        const type = search.type ?? "offer";
        const base = emptyLetter(type);
        setLetter({
          ...base,
          id: "",
          candidateId: search.candidateId ?? null,
          name: search.name ?? "",
          email: search.email ?? "",
          phone: search.phone ?? "",
          position: search.position ?? base.position,
          employmentType: search.employmentType ?? base.employmentType,
          location: locationOptions(o)[0] ?? "Remote",
          signatoryName: o.signatoryName,
          signatoryTitle: o.signatoryTitle,
          letterId: await nextLetterId(type),
        });
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.id]);

  const set = <K extends keyof Letter>(key: K, value: Letter[K]) =>
    setLetter((l) => ({ ...l, [key]: value }));

  async function changeType(type: LetterType) {
    const letterId = search.id ? letter.letterId : await nextLetterId(type);
    setLetter((l) => ({ ...l, type, letterId }));
  }

  async function save() {
    if (!letter.name.trim()) {
      toast.error("Candidate name is required");
      return false;
    }
    try {
      const stored = await saveLetter({
        ...letter,
        letterId: letter.letterId || (await nextLetterId(letter.type)),
      });
      setLetter(stored);
      if (stored.candidateId && letter.type === "offer") {
        await updateCandidate(stored.candidateId, { stage: "Offer Sent" });
      }
      toast.success(`Saved as ${stored.letterId}`);
      navigate({ to: "/generate", search: { id: stored.id }, replace: true });
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
      return false;
    }
  }

  async function downloadPdf() {
    if (await save()) setTimeout(() => window.print(), 350);
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {search.id ? "Edit letter" : "Generate letter"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Reference ID: <strong className="text-foreground">{letter.letterId}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLetter(emptyLetter(letter.type))}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button variant="outline" onClick={() => setShowTerms((v) => !v)}>
              <FileText className="mr-2 h-4 w-4" /> {showTerms ? "Hide" : "Include"} terms page
            </Button>
            <Button variant="outline" onClick={() => void save()}>
              <Save className="mr-2 h-4 w-4" /> Save record
            </Button>
            <Button onClick={() => void downloadPdf()}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="no-print space-y-6 rounded-xl border border-border bg-card p-5">
            <div className="space-y-4">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Letter
              </h2>
              <Field label="Letter type">
                <Select value={letter.type} onValueChange={(v) => void changeType(v as LetterType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LETTER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Letter date" htmlFor="letterDate">
                <Input
                  id="letterDate"
                  type="date"
                  value={letter.letterDate}
                  onChange={(e) => set("letterDate", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Candidate details
              </h2>
              <Field label="Full name" htmlFor="name">
                <Input
                  id="name"
                  maxLength={80}
                  value={letter.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Aman Verma"
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  maxLength={120}
                  value={letter.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="Contact number" htmlFor="phone">
                <Input
                  id="phone"
                  maxLength={20}
                  value={letter.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </Field>
              <Field label="Address" htmlFor="address">
                <Textarea
                  id="address"
                  rows={2}
                  maxLength={200}
                  value={letter.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Position details
              </h2>
              <Field label="Position">
                <Select value={letter.position} onValueChange={(v) => set("position", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Custom position (optional)" htmlFor="customPos">
                <Input
                  id="customPos"
                  maxLength={60}
                  placeholder="Type to override the list"
                  onChange={(e) => e.target.value && set("position", e.target.value)}
                />
              </Field>
              <Field label="Selection type">
                <Select
                  value={letter.employmentType}
                  onValueChange={(v) => set("employmentType", v as EmploymentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Department" htmlFor="dept">
                <Input
                  id="dept"
                  maxLength={60}
                  value={letter.department}
                  onChange={(e) => set("department", e.target.value)}
                  placeholder="e.g. Engineering"
                />
              </Field>
              <Field label="Office location">
                <Select value={letter.location} onValueChange={(v) => set("location", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set([...locationOptions(org), "Remote", letter.location].filter(Boolean))].map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Reporting to" htmlFor="reportingTo">
                <Input
                  id="reportingTo"
                  maxLength={60}
                  value={letter.reportingTo}
                  onChange={(e) => set("reportingTo", e.target.value)}
                />
              </Field>
              <Field label="Start / joining date" htmlFor="startDate">
                <Input
                  id="startDate"
                  type="date"
                  value={letter.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Compensation &amp; terms
              </h2>
              <Field label="CTC / Salary" htmlFor="ctc">
                <Input
                  id="ctc"
                  maxLength={60}
                  value={letter.ctc}
                  onChange={(e) => set("ctc", e.target.value)}
                  placeholder="e.g. INR 6,00,000 per annum"
                />
              </Field>
              <Field label="Stipend (for interns)" htmlFor="stipend">
                <Input
                  id="stipend"
                  maxLength={60}
                  value={letter.stipend}
                  onChange={(e) => set("stipend", e.target.value)}
                  placeholder="e.g. INR 10,000 per month"
                />
              </Field>
              <Field label="Pay cycle" htmlFor="payCycle">
                <Input
                  id="payCycle"
                  maxLength={30}
                  value={letter.payCycle}
                  onChange={(e) => set("payCycle", e.target.value)}
                />
              </Field>
              <Field label="Internship / contract duration" htmlFor="duration">
                <Input
                  id="duration"
                  maxLength={40}
                  value={letter.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="e.g. 6 months"
                />
              </Field>
              <Field label="Probation" htmlFor="probation">
                <Input
                  id="probation"
                  maxLength={40}
                  value={letter.probation}
                  onChange={(e) => set("probation", e.target.value)}
                />
              </Field>
              <Field label="Working hours" htmlFor="workHours">
                <Input
                  id="workHours"
                  maxLength={80}
                  value={letter.workHours}
                  onChange={(e) => set("workHours", e.target.value)}
                />
              </Field>
              <Field label="Additional note (optional)" htmlFor="notes">
                <Textarea
                  id="notes"
                  rows={3}
                  maxLength={500}
                  value={letter.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
                Signature
              </h2>
              <Field label="Signatory name" htmlFor="signatoryName">
                <Input
                  id="signatoryName"
                  maxLength={60}
                  value={letter.signatoryName}
                  onChange={(e) => set("signatoryName", e.target.value)}
                />
              </Field>
              <Field label="Signatory title" htmlFor="signatoryTitle">
                <Input
                  id="signatoryTitle"
                  maxLength={80}
                  value={letter.signatoryTitle}
                  onChange={(e) => set("signatoryTitle", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div>
            <LetterDocument letter={letter} showTerms={showTerms} org={org} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
