import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ORG, type Org } from "@/lib/org";
import {
  PREFIX,
  emptyLetter,
  type Candidate,
  type EmploymentType,
  type Letter,
  type LetterType,
  type Stage,
} from "@/lib/letters";
import type { IdCard } from "@/lib/idcards";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sb = supabase as any;

function must<T = any>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

/* ------------------------------- org ------------------------------- */

export async function loadOrg(): Promise<Org> {
  const { data, error } = await sb.from("org_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_ORG;
  return {
    name: data.name || DEFAULT_ORG.name,
    tagline: data.tagline ?? "",
    website: data.website ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address1: data.address1 ?? "",
    address2: data.address2 ?? "",
    gst: data.gst ?? "",
    cin: data.cin ?? "",
    signatoryName: data.signatory_name || DEFAULT_ORG.signatoryName,
    signatoryTitle: data.signatory_title || DEFAULT_ORG.signatoryTitle,
    hrEmail: data.hr_email ?? "",
  };
}

export async function saveOrg(org: Org) {
  must(
    await sb.from("org_settings").upsert(
      {
        id: 1,
        name: org.name,
        tagline: org.tagline,
        website: org.website,
        email: org.email,
        phone: org.phone,
        address1: org.address1,
        address2: org.address2,
        gst: org.gst,
        cin: org.cin,
        signatory_name: org.signatoryName,
        signatory_title: org.signatoryTitle,
        hr_email: org.hrEmail,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    ),
  );
}

/* ---------------------------- candidates ---------------------------- */

function toCandidate(r: any): Candidate {
  return {
    id: r.id,
    name: r.name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    position: r.position ?? "",
    employmentType: (r.employment_type ?? "Fresher") as EmploymentType,
    source: r.source ?? "",
    stage: (r.stage ?? "Applied") as Stage,
    resumeText: r.resume_text ?? "",
    resumeFile: r.resume_file ?? "",
    aiScore: r.ai_score ?? null,
    aiSummary: r.ai_summary ?? "",
    aiStrengths: r.ai_strengths ?? [],
    aiGaps: r.ai_gaps ?? [],
    interviewAt: r.interview_at ?? null,
    interviewMode: r.interview_mode ?? "Google Meet",
    interviewStatus: r.interview_status ?? "Not scheduled",
    interviewNotes: r.interview_notes ?? "",
    inviteSentAt: r.invite_sent_at ?? null,
    notes: r.notes ?? "",
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}

function candidateRow(c: Partial<Candidate>) {
  const row: Record<string, unknown> = {};
  const map: Record<string, string> = {
    name: "name",
    email: "email",
    phone: "phone",
    position: "position",
    employmentType: "employment_type",
    source: "source",
    stage: "stage",
    resumeText: "resume_text",
    resumeFile: "resume_file",
    aiScore: "ai_score",
    aiSummary: "ai_summary",
    aiStrengths: "ai_strengths",
    aiGaps: "ai_gaps",
    interviewAt: "interview_at",
    interviewMode: "interview_mode",
    interviewStatus: "interview_status",
    interviewNotes: "interview_notes",
    inviteSentAt: "invite_sent_at",
    notes: "notes",
  };
  for (const [k, col] of Object.entries(map)) {
    const v = (c as Record<string, unknown>)[k];
    if (v !== undefined) row[col] = v;
  }
  return row;
}

export async function listCandidates(): Promise<Candidate[]> {
  const data = must(
    await sb
      .from("candidates")
      .select("*")
      .order("ai_score", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
  );
  return ((data ?? []) as any[]).map(toCandidate);
}

export async function addCandidate(c: Partial<Candidate>): Promise<Candidate> {
  const data = must(await sb.from("candidates").insert(candidateRow(c)).select("*").single());
  return toCandidate(data);
}

export async function addCandidates(list: Partial<Candidate>[]): Promise<Candidate[]> {
  if (list.length === 0) return [];
  const data = must(await sb.from("candidates").insert(list.map(candidateRow)).select("*"));
  return ((data ?? []) as any[]).map(toCandidate);
}

export async function updateCandidate(id: string, patch: Partial<Candidate>) {
  must(
    await sb
      .from("candidates")
      .update({ ...candidateRow(patch), updated_at: new Date().toISOString() })
      .eq("id", id),
  );
}

export async function deleteCandidate(id: string) {
  must(await sb.from("candidates").delete().eq("id", id));
}

/* ------------------------------ letters ----------------------------- */

function toLetter(r: any): Letter {
  const base = emptyLetter();
  return {
    ...base,
    id: r.id,
    letterId: r.letter_id ?? "",
    type: (r.type ?? "offer") as LetterType,
    candidateId: r.candidate_id ?? null,
    createdAt: r.created_at ?? base.createdAt,
    updatedAt: r.updated_at ?? base.updatedAt,
    name: r.name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    address: r.address ?? "",
    position: r.position ?? "",
    employmentType: (r.employment_type ?? "Fresher") as EmploymentType,
    department: r.department ?? "",
    location: r.location ?? "",
    reportingTo: r.reporting_to ?? "",
    startDate: r.start_date ?? "",
    letterDate: r.letter_date ?? "",
    ctc: r.ctc ?? "",
    payCycle: r.pay_cycle ?? "Monthly",
    probation: r.probation ?? "",
    workHours: r.work_hours ?? "",
    stipend: r.stipend ?? "",
    duration: r.duration ?? "",
    notes: r.notes ?? "",
    signatoryName: r.signatory_name ?? "",
    signatoryTitle: r.signatory_title ?? "",
  };
}

function letterRow(l: Letter) {
  return {
    letter_id: l.letterId,
    type: l.type,
    candidate_id: l.candidateId,
    name: l.name,
    email: l.email,
    phone: l.phone,
    address: l.address,
    position: l.position,
    employment_type: l.employmentType,
    department: l.department,
    location: l.location,
    reporting_to: l.reportingTo,
    start_date: l.startDate || null,
    letter_date: l.letterDate || null,
    ctc: l.ctc,
    pay_cycle: l.payCycle,
    probation: l.probation,
    work_hours: l.workHours,
    stipend: l.stipend,
    duration: l.duration,
    notes: l.notes,
    signatory_name: l.signatoryName,
    signatory_title: l.signatoryTitle,
    updated_at: new Date().toISOString(),
  };
}

export async function listLetters(): Promise<Letter[]> {
  const data = must(
    await sb.from("letters").select("*").order("created_at", { ascending: false }),
  );
  return ((data ?? []) as any[]).map(toLetter);
}

export async function getLetterById(id: string): Promise<Letter | null> {
  const { data, error } = await sb.from("letters").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return toLetter(data);
}

export async function nextLetterId(type: LetterType): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await sb
    .from("letters")
    .select("id", { count: "exact", head: true })
    .eq("type", type);
  return `HRM/${PREFIX[type]}/${year}/${String((count ?? 0) + 1).padStart(4, "0")}`;
}

/** Insert or update, returns the stored letter (with real database id). */
export async function saveLetter(letter: Letter): Promise<Letter> {
  const exists = letter.id
    ? (await sb.from("letters").select("id").eq("id", letter.id).maybeSingle()).data
    : null;
  if (exists) {
    const data = must(
      await sb.from("letters").update(letterRow(letter)).eq("id", letter.id).select("*").single(),
    );
    return toLetter(data);
  }
  const data = must(await sb.from("letters").insert(letterRow(letter)).select("*").single());
  return toLetter(data);
}

export async function deleteLetter(id: string) {
  must(await sb.from("letters").delete().eq("id", id));
}

/* ------------------------------ id cards ---------------------------- */

function toCard(r: any): IdCard {
  return {
    id: r.id,
    employeeId: r.employee_id ?? "",
    letterRef: r.letter_ref ?? "",
    name: r.name ?? "",
    position: r.position ?? "",
    department: r.department ?? "",
    employmentType: r.employment_type ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    location: r.location ?? "",
    bloodGroup: r.blood_group ?? "",
    emergencyContact: r.emergency_contact ?? "",
    issueDate: r.issue_date ?? "",
    validTill: r.valid_till ?? "",
    photo: r.photo ?? "",
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}

function cardRow(c: IdCard) {
  return {
    employee_id: c.employeeId,
    letter_ref: c.letterRef,
    name: c.name,
    position: c.position,
    department: c.department,
    employment_type: c.employmentType,
    email: c.email,
    phone: c.phone,
    location: c.location,
    blood_group: c.bloodGroup,
    emergency_contact: c.emergencyContact,
    issue_date: c.issueDate || null,
    valid_till: c.validTill || null,
    photo: c.photo,
  };
}

export async function listIdCards(): Promise<IdCard[]> {
  const data = must(
    await sb.from("id_cards").select("*").order("created_at", { ascending: false }),
  );
  return ((data ?? []) as any[]).map(toCard);
}

export async function nextEmployeeId(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await sb.from("id_cards").select("id", { count: "exact", head: true });
  return `HRM/EMP/${year}/${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export async function saveIdCard(card: IdCard): Promise<IdCard> {
  const exists = card.id
    ? (await sb.from("id_cards").select("id").eq("id", card.id).maybeSingle()).data
    : null;
  if (exists) {
    const data = must(
      await sb.from("id_cards").update(cardRow(card)).eq("id", card.id).select("*").single(),
    );
    return toCard(data);
  }
  const data = must(await sb.from("id_cards").insert(cardRow(card)).select("*").single());
  return toCard(data);
}

export async function deleteIdCard(id: string) {
  must(await sb.from("id_cards").delete().eq("id", id));
}

/* ------------------------------ feedback ---------------------------- */

export type Feedback = {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  aiReply: string;
  createdAt: string;
};

export async function listFeedback(): Promise<Feedback[]> {
  const data = must(
    await sb.from("feedback").select("*").order("created_at", { ascending: false }),
  );
  return ((data ?? []) as any[]).map((r: any) => ({
    id: r.id,
    name: r.name ?? "",
    email: r.email ?? "",
    rating: r.rating ?? 0,
    message: r.message ?? "",
    aiReply: r.ai_reply ?? "",
    createdAt: r.created_at,
  }));
}

export async function addFeedback(f: {
  name: string;
  email: string;
  rating: number;
  message: string;
  aiReply: string;
}) {
  must(
    await sb.from("feedback").insert({
      name: f.name,
      email: f.email,
      rating: f.rating,
      message: f.message,
      ai_reply: f.aiReply,
    }),
  );
}

/* ----------------------------- email log ---------------------------- */

export type EmailRow = {
  id: string;
  candidateId: string | null;
  toEmail: string;
  subject: string;
  body: string;
  purpose: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
};

export async function listEmails(): Promise<EmailRow[]> {
  const data = must(
    await sb.from("email_log").select("*").order("created_at", { ascending: false }).limit(200),
  );
  return ((data ?? []) as any[]).map((r: any) => ({
    id: r.id,
    candidateId: r.candidate_id,
    toEmail: r.to_email ?? "",
    subject: r.subject ?? "",
    body: r.body ?? "",
    purpose: r.purpose ?? "",
    status: r.status ?? "Draft",
    sentAt: r.sent_at,
    createdAt: r.created_at,
  }));
}

export async function logEmail(e: {
  candidateId: string | null;
  toEmail: string;
  subject: string;
  body: string;
  purpose?: string;
  status?: string;
}) {
  must(
    await sb.from("email_log").insert({
      candidate_id: e.candidateId,
      to_email: e.toEmail,
      subject: e.subject,
      body: e.body,
      purpose: e.purpose ?? "Interview invitation",
      status: e.status ?? "Sent",
      sent_at: new Date().toISOString(),
    }),
  );
}
