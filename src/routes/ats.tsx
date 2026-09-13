import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  FileText,
  Mail,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
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
  INTERVIEW_STATUSES,
  POSITIONS,
  STAGES,
  formatDateTime,
  type Candidate,
  type EmploymentType,
  type Stage,
} from "@/lib/letters";
import { extractResumeText, guessContact } from "@/lib/resume";
import {
  addCandidate,
  addCandidates,
  deleteCandidate,
  listCandidates,
  loadOrg,
  logEmail,
  updateCandidate,
} from "@/lib/db";
import { DEFAULT_ORG, type Org } from "@/lib/org";

export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "AI Applicant Tracking | AI-HRM" },
      {
        name: "description",
        content:
          "Upload many resumes at once, let AI score and shortlist the best fit, send interview invitations, track interviews and issue letters from one pipeline.",
      },
      { property: "og:title", content: "AI Applicant Tracking | AI-HRM" },
      {
        property: "og:description",
        content: "Resume ranking, interview invitations and hiring stages in one workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AtsPage,
});

const stageTone: Record<Stage, string> = {
  Applied: "bg-secondary text-secondary-foreground",
  Screening: "bg-secondary text-secondary-foreground",
  Interview: "bg-accent text-accent-foreground",
  Selected: "bg-primary text-primary-foreground",
  "Offer Sent": "bg-primary text-primary-foreground",
  Joined: "bg-brand text-brand-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
};

function scoreTone(score: number) {
  if (score >= 80) return "text-brand";
  if (score >= 60) return "text-primary";
  return "text-muted-foreground";
}

function AtsPage() {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [org, setOrg] = useState<Org>(DEFAULT_ORG);
  const [role, setRole] = useState(POSITIONS[0]!);
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Fresher");
  const [pasted, setPasted] = useState("");
  const [pastedName, setPastedName] = useState("");
  const [busy, setBusy] = useState("");
  const [openInvite, setOpenInvite] = useState<string | null>(null);
  const [slot, setSlot] = useState("");
  const [mode, setMode] = useState("Google Meet");
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setRows(await listCandidates());
  }

  useEffect(() => {
    void (async () => {
      setOrg(await loadOrg());
      try {
        await refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load candidates");
      }
    })();
  }, []);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy("Reading resumes…");
    try {
      const parsed: Partial<Candidate>[] = [];
      for (const file of Array.from(files).slice(0, 30)) {
        const text = await extractResumeText(file);
        if (!text) continue;
        const info = guessContact(text, file.name);
        parsed.push({
          ...info,
          position: role,
          employmentType,
          source: "Resume upload",
          stage: "Applied",
          resumeText: text.slice(0, 40000),
          resumeFile: file.name,
        });
      }
      if (parsed.length === 0) {
        toast.error("No readable text found in those files");
        return;
      }
      await addCandidates(parsed);
      await refresh();
      toast.success(`${parsed.length} resume${parsed.length === 1 ? "" : "s"} added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read those files");
    } finally {
      setBusy("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function addPasted() {
    if (!pasted.trim()) {
      toast.error("Paste the resume text first");
      return;
    }
    const info = guessContact(pasted, pastedName || "Candidate");
    await addCandidate({
      ...info,
      name: pastedName.trim() || info.name,
      position: role,
      employmentType,
      source: "Pasted resume",
      stage: "Applied",
      resumeText: pasted.slice(0, 40000),
    });
    setPasted("");
    setPastedName("");
    await refresh();
    toast.success("Candidate added");
  }

  async function rank() {
    const pool = rows.filter((r) => r.resumeText.trim().length > 40);
    if (pool.length === 0) {
      toast.error("Add at least one resume with text first");
      return;
    }
    setBusy("AI is scoring resumes…");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rank",
          role: `${role} (${employmentType})`,
          candidates: pool.map((c) => ({
            id: c.id,
            name: c.name,
            position: c.position,
            resumeText: c.resumeText,
          })),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        results?: {
          id: string;
          score: number;
          summary: string;
          strengths: string[];
          gaps: string[];
        }[];
      };
      if (!res.ok || !data.results) throw new Error(data.error ?? "Ranking failed");
      for (const r of data.results) {
        await updateCandidate(r.id, {
          aiScore: Math.max(0, Math.min(100, Math.round(r.score))),
          aiSummary: r.summary ?? "",
          aiStrengths: r.strengths ?? [],
          aiGaps: r.gaps ?? [],
          stage: "Screening",
        });
      }
      await refresh();
      toast.success("Candidates ranked — strongest fit is on top");
    } catch (e) {
      toast.error(e instanceof Error ? e.message.slice(0, 140) : "Ranking failed");
    } finally {
      setBusy("");
    }
  }

  async function patch(id: string, p: Partial<Candidate>) {
    await updateCandidate(id, p);
    setRows((list) => list.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  async function sendInvite(c: Candidate) {
    if (!c.email) {
      toast.error("Add the candidate email first");
      return;
    }
    if (!slot) {
      toast.error("Pick an interview date and time");
      return;
    }
    const when = new Date(slot);
    const subject = `Interview invitation — ${c.position} at ${org.name}`;
    const body = [
      `Dear ${c.name || "Candidate"},`,
      "",
      `Thank you for applying for the ${c.position} (${c.employmentType}) role at ${org.name}.`,
      `We would like to invite you to an interview on ${when.toLocaleString("en-IN")} via ${mode}.`,
      "",
      "Please reply to confirm your availability. If this slot does not work, share two alternatives.",
      "",
      "Best regards,",
      org.signatoryName || "Talent Acquisition",
      org.name,
      org.hrEmail || org.email || "",
    ].join("\n");

    await patch(c.id, {
      interviewAt: when.toISOString(),
      interviewMode: mode,
      interviewStatus: "Invited",
      inviteSentAt: new Date().toISOString(),
      stage: "Interview",
    });
    await logEmail({
      candidateId: c.id,
      toEmail: c.email,
      subject,
      body,
      purpose: "Interview invitation",
      status: "Sent",
    });
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      c.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmail, "_blank", "noopener");
    setOpenInvite(null);
    toast.success("Invitation prepared and logged");
  }

  async function remove(id: string) {
    await deleteCandidate(id);
    await refresh();
    toast.success("Candidate removed");
  }

  const ranked = rows.filter((r) => r.aiScore !== null).length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Applicant tracking</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bring in many resumes, let AI shortlist the strongest fit, invite them to interview and
          move them all the way to their letter.
        </p>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
              Role you are hiring for
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Position</Label>
                <Select value={role} onValueChange={setRole}>
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
                  value={employmentType}
                  onValueChange={(v) => setEmploymentType(v as EmploymentType)}
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
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => void onFiles(e.target.files)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={!!busy}>
                <Upload className="mr-2 h-4 w-4" /> Upload resumes
              </Button>
              <Button onClick={() => void rank()} disabled={!!busy}>
                <Sparkles className="mr-2 h-4 w-4" /> {busy || "Rank with AI"}
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              PDF, Word or text files — up to 30 at a time. {ranked} of {rows.length} candidates
              scored.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
              Or paste a resume
            </h2>
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Candidate name (optional)"
                maxLength={60}
                value={pastedName}
                onChange={(e) => setPastedName(e.target.value)}
              />
              <Textarea
                rows={6}
                maxLength={20000}
                placeholder="Paste the full resume text here"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
              <Button variant="outline" onClick={() => void addPasted()}>
                <Plus className="mr-2 h-4 w-4" /> Add candidate
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-primary">
            <BarChart3 className="h-4 w-4" /> Pipeline ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No candidates yet. Upload a batch of resumes to get started.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {rows.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary">
                      <span className={`font-display text-base font-bold ${scoreTone(c.aiScore ?? 0)}`}>
                        {c.aiScore ?? "—"}
                      </span>
                      <span className="text-[8px] uppercase text-muted-foreground">fit</span>
                    </div>
                    <div className="min-w-[220px] flex-1">
                      <p className="font-semibold">{c.name || "Unnamed candidate"}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.position} · {c.employmentType} · {c.source}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.email || "no email"} {c.phone ? `· ${c.phone}` : ""}
                      </p>
                      {c.aiSummary ? (
                        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                          {c.aiSummary}
                        </p>
                      ) : null}
                      {c.aiStrengths.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.aiStrengths.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={stageTone[c.stage]}>{c.stage}</Badge>
                      <Select
                        value={c.stage}
                        onValueChange={(v) => void patch(c.id, { stage: v as Stage })}
                      >
                        <SelectTrigger className="w-[140px]">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOpenInvite(openInvite === c.id ? null : c.id);
                          setSlot(c.interviewAt ? c.interviewAt.slice(0, 16) : "");
                          setMode(c.interviewMode || "Google Meet");
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4" /> Invite
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          to="/generate"
                          search={{
                            type: "offer",
                            candidateId: c.id,
                            name: c.name,
                            email: c.email,
                            phone: c.phone,
                            position: c.position,
                            employmentType: c.employmentType,
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" /> Letter
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => void remove(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {openInvite === c.id ? (
                    <div className="mt-4 grid gap-3 rounded-lg bg-secondary/60 p-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Date &amp; time</Label>
                        <Input
                          type="datetime-local"
                          value={slot}
                          onChange={(e) => setSlot(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Mode</Label>
                        <Select value={mode} onValueChange={setMode}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Google Meet", "Zoom", "Telephonic", "In office"].map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button className="w-full" onClick={() => void sendInvite(c)}>
                          <Mail className="mr-2 h-4 w-4" /> Send invitation
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {c.interviewAt ? formatDateTime(c.interviewAt) : "No interview scheduled"}
                      {c.interviewAt ? ` · ${c.interviewMode}` : ""}
                    </span>
                    <Select
                      value={c.interviewStatus}
                      onValueChange={(v) => void patch(c.id, { interviewStatus: v })}
                    >
                      <SelectTrigger className="h-8 w-[150px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INTERVIEW_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className="h-8 max-w-sm flex-1 text-xs"
                      placeholder="Interview notes"
                      maxLength={400}
                      defaultValue={c.interviewNotes}
                      onBlur={(e) => void patch(c.id, { interviewNotes: e.target.value })}
                    />
                    {c.inviteSentAt ? (
                      <span className="text-[11px] text-muted-foreground">
                        Invited {formatDateTime(c.inviteSentAt)}
                      </span>
                    ) : null}
                  </div>
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
