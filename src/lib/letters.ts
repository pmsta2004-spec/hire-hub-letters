export type LetterType = "offer" | "joining" | "appointment";

export const LETTER_TYPES: { value: LetterType; label: string }[] = [
  { value: "offer", label: "Offer Letter" },
  { value: "joining", label: "Letter of Joining" },
  { value: "appointment", label: "Appointment Letter" },
];

export type EmploymentType =
  | "Intern"
  | "Fresher"
  | "Experienced"
  | "Contract"
  | "Full-time"
  | "Part-time";

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Intern",
  "Fresher",
  "Experienced",
  "Full-time",
  "Part-time",
  "Contract",
];

export const POSITIONS = [
  "Software Engineer Intern",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI/ML Engineer",
  "Product Manager",
  "QA Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Business Development Executive",
  "Sales Manager",
  "Marketing Intern",
  "Digital Marketing Executive",
  "HR Executive",
  "HR Intern",
  "Accounts Executive",
  "Operations Manager",
  "Customer Support Executive",
  "Graphic Designer",
];

export type Letter = {
  id: string;
  letterId: string;
  type: LetterType;
  candidateId: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  employmentType: EmploymentType;
  department: string;
  location: string;
  reportingTo: string;
  startDate: string;
  letterDate: string;
  ctc: string;
  payCycle: string;
  probation: string;
  workHours: string;
  stipend: string;
  duration: string;
  notes: string;
  signatoryName: string;
  signatoryTitle: string;
};

export const STAGES = [
  "Applied",
  "Screening",
  "Interview",
  "Selected",
  "Offer Sent",
  "Joined",
  "Rejected",
] as const;
export type Stage = (typeof STAGES)[number];

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  employmentType: EmploymentType;
  source: string;
  stage: Stage;
  resumeText: string;
  resumeFile: string;
  aiScore: number | null;
  aiSummary: string;
  aiStrengths: string[];
  aiGaps: string[];
  interviewAt: string | null;
  interviewMode: string;
  interviewStatus: string;
  interviewNotes: string;
  inviteSentAt: string | null;
  notes: string;
  createdAt: string;
};

export const INTERVIEW_STATUSES = [
  "Not scheduled",
  "Invited",
  "Confirmed",
  "Completed",
  "No show",
  "Cancelled",
] as const;

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const PREFIX: Record<LetterType, string> = {
  offer: "OFR",
  joining: "JOL",
  appointment: "APT",
};

export function emptyLetter(type: LetterType = "offer"): Letter {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: uid(),
    letterId: "",
    type,
    candidateId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "",
    email: "",
    phone: "",
    address: "",
    position: POSITIONS[0]!,
    employmentType: "Fresher",
    department: "",
    location: "",
    reportingTo: "",
    startDate: today,
    letterDate: today,
    ctc: "",
    payCycle: "Monthly",
    probation: "3 months",
    workHours: "10:00 AM – 7:00 PM, Monday to Saturday",
    stipend: "",
    duration: "",
    notes: "",
    signatoryName: "",
    signatoryTitle: "",
  };
}

export function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  const date = new Date(`${d.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(d: string | null | undefined) {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
