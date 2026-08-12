import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMPLOYMENT_TYPES,
  POSITIONS,
  STAGES,
  deleteApplicant,
  getApplicants,
  saveApplicant,
  uid,
  type Applicant,
  type EmploymentType,
  type Stage,
} from "@/lib/letters";

export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "Applicant Tracking System | EvolveNest Energy HR Suite" },
      {
        name: "description",
        content:
          "Track applicants for interns, freshers and experienced roles through screening, interview, selection and joining — then issue their letter instantly.",
      },
      { property: "og:title", content: "Applicant Tracking System | EvolveNest Energy" },
      {
        property: "og:description",
        content: "Simple applicant tracking with stages and one-click letter generation.",
      },
    ],
  }),
  component: AtsPage,
});

function emptyApplicant(): Applicant {
  return {
    id: uid(),
    name: "",
    email: "",
    phone: "",
    position: POSITIONS[0]!,
    employmentType: "Fresher",
    source: "Website",
    stage: "Applied",
    notes: "",
    createdAt: new Date().toISOString(),
  };
}

const stageTone: Record<Stage, string> = {
  Applied: "bg-secondary text-secondary-foreground",
  Screening: "bg-secondary text-secondary-foreground",
  Interview: "bg-accent text-accent-foreground",
  Selected: "bg-primary text-primary-foreground",
  "Offer Sent": "bg-primary text-primary-foreground",
  Joined: "bg-brand text-brand-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
};

function AtsPage() {
  const [rows, setRows] = useState<Applicant[]>([]);
  const [draft, setDraft] = useState<Applicant>(emptyApplicant);

  useEffect(() => setRows(getApplicants()), []);

  function add() {
    if (!draft.name.trim()) {
      toast.error("Applicant name is required");
      return;
    }
    saveApplicant(draft);
    setRows(getApplicants());
    setDraft(emptyApplicant());
    toast.success("Applicant added");
  }

  function updateStage(a: Applicant, stage: Stage) {
    saveApplicant({ ...a, stage });
    setRows(getApplicants());
  }

  function remove(id: string) {
    deleteApplicant(id);
    setRows(getApplicants());
    toast.success("Applicant removed");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Applicant Tracking System</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add applicants, move them through hiring stages and generate their letter directly.
        </p>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            Add applicant
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="aname" className="text-xs text-muted-foreground">
                Full name
              </Label>
              <Input
                id="aname"
                maxLength={80}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="aemail" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="aemail"
                type="email"
                maxLength={120}
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="aphone" className="text-xs text-muted-foreground">
                Contact number
              </Label>
              <Input
                id="aphone"
                maxLength={20}
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Position applied</Label>
              <Select
                value={draft.position}
                onValueChange={(v) => setDraft({ ...draft, position: v })}
              >
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
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Candidate type</Label>
              <Select
                value={draft.employmentType}
                onValueChange={(v) => setDraft({ ...draft, employmentType: v as EmploymentType })}
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
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Stage</Label>
              <Select
                value={draft.stage}
                onValueChange={(v) => setDraft({ ...draft, stage: v as Stage })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <Label htmlFor="anotes" className="text-xs text-muted-foreground">
                Notes
              </Label>
              <Textarea
                id="anotes"
                rows={2}
                maxLength={400}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={add}>
            <Plus className="mr-2 h-4 w-4" /> Add applicant
          </Button>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            Pipeline ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No applicants yet. Add your first candidate above.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {rows.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-[200px] flex-1">
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.position} · {a.employmentType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.email} {a.phone ? `· ${a.phone}` : ""}
                    </p>
                    {a.notes ? <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p> : null}
                  </div>
                  <Badge className={stageTone[a.stage]}>{a.stage}</Badge>
                  <Select value={a.stage} onValueChange={(v) => updateStage(a, v as Stage)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to="/generate"
                      search={{
                        type: "offer",
                        name: a.name,
                        email: a.email,
                        phone: a.phone,
                        position: a.position,
                        employmentType: a.employmentType,
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Letter
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(a.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
