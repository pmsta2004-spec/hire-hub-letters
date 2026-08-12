import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Save, RotateCcw } from "lucide-react";
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
  OFFICE_LOCATIONS,
  POSITIONS,
  emptyLetter,
  getLetter,
  nextLetterId,
  saveLetter,
  type EmploymentType,
  type Letter,
  type LetterType,
} from "@/lib/letters";

type Search = { id?: string; type?: LetterType; name?: string; email?: string; phone?: string; position?: string; employmentType?: EmploymentType };

export const Route = createFileRoute("/generate")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
    type: (["offer", "joining", "appointment"] as const).includes(search.type as LetterType)
      ? (search.type as LetterType)
      : undefined,
    name: typeof search.name === "string" ? search.name : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
    phone: typeof search.phone === "string" ? search.phone : undefined,
    position: typeof search.position === "string" ? search.position : undefined,
    employmentType:
      typeof search.employmentType === "string"
        ? (search.employmentType as EmploymentType)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Generate Offer, Joining & Appointment Letters | EvolveNest Energy" },
      {
        name: "description",
        content:
          "Fill in candidate and role details to instantly generate a company-branded offer letter, joining letter or appointment letter with PDF download.",
      },
      { property: "og:title", content: "Generate HR Letters | EvolveNest Energy" },
      {
        property: "og:description",
        content: "Create branded offer, joining and appointment letters with unique reference IDs.",
      },
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

  useEffect(() => {
    const existing = search.id ? getLetter(search.id) : undefined;
    if (existing) {
      setLetter(existing);
    } else {
      const base = emptyLetter(search.type ?? "offer");
      setLetter({
        ...base,
        name: search.name ?? "",
        email: search.email ?? "",
        phone: search.phone ?? "",
        position: search.position ?? base.position,
        employmentType: search.employmentType ?? base.employmentType,
        letterId: nextLetterId(search.type ?? "offer"),
      });
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.id]);

  const set = <K extends keyof Letter>(key: K, value: Letter[K]) =>
    setLetter((l) => ({ ...l, [key]: value }));

  function changeType(type: LetterType) {
    setLetter((l) => ({
      ...l,
      type,
      letterId: search.id ? l.letterId : nextLetterId(type),
    }));
  }

  function save() {
    if (!letter.name.trim()) {
      toast.error("Candidate name is required");
      return;
    }
    const payload: Letter = {
      ...letter,
      letterId: letter.letterId || nextLetterId(letter.type),
      updatedAt: new Date().toISOString(),
    };
    saveLetter(payload);
    setLetter(payload);
    toast.success(`Saved as ${payload.letterId}`);
    navigate({ to: "/generate", search: { id: payload.id }, replace: true });
  }

  function downloadPdf() {
    save();
    setTimeout(() => window.print(), 350);
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
            <Button variant="outline" onClick={save}>
              <Save className="mr-2 h-4 w-4" /> Save record
            </Button>
            <Button onClick={downloadPdf}>
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
                <Select value={letter.type} onValueChange={(v) => changeType(v as LetterType)}>
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
                    {OFFICE_LOCATIONS.map((o) => (
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
            <LetterDocument letter={letter} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
