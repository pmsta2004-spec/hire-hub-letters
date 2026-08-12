export type LetterType = "offer" | "joining" | "appointment";

export const LETTER_TYPES: { value: LetterType; label: string }[] = [
  { value: "offer", label: "Offer Letter" },
  { value: "joining", label: "Letter of Joining" },
  { value: "appointment", label: "Appointment Letter" },
];

export type EmploymentType = "Intern" | "Fresher" | "Experienced" | "Contract" | "Full-time" | "Part-time";

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
  "Solar Design Engineer",
  "Electrical Engineer",
  "Project Engineer",
  "Site Supervisor",
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

export const OFFICE_LOCATIONS = [
  "K No-34 Khushi Vihar, Manaknagar, Lucknow, Uttar Pradesh, India",
  "Office No. 306, Prisma Business Park, AB Road, Indore, India",
  "Remote",
];

export type Letter = {
  id: string;
  letterId: string;
  type: LetterType;
  createdAt: string;
  updatedAt: string;
  // candidate
  name: string;
  email: string;
  phone: string;
  address: string;
  // role
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

export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  employmentType: EmploymentType;
  source: string;
  stage: Stage;
  notes: string;
  createdAt: string;
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

const LETTER_KEY = "ene_letters_v1";
const APPLICANT_KEY = "ene_applicants_v1";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]) {
  window.localStorage.setItem(key, JSON.stringify(rows));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const PREFIX: Record<LetterType, string> = {
  offer: "OFR",
  joining: "JOL",
  appointment: "APT",
};

export function nextLetterId(type: LetterType) {
  const year = new Date().getFullYear();
  const count = getLetters().filter((l) => l.type === type).length + 1;
  return `ENE/${PREFIX[type]}/${year}/${String(count).padStart(4, "0")}`;
}

export function getLetters(): Letter[] {
  return read<Letter>(LETTER_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getLetter(id: string) {
  return getLetters().find((l) => l.id === id);
}

export function saveLetter(letter: Letter) {
  const rows = read<Letter>(LETTER_KEY);
  const i = rows.findIndex((r) => r.id === letter.id);
  if (i >= 0) rows[i] = letter;
  else rows.push(letter);
  write(LETTER_KEY, rows);
}

export function deleteLetter(id: string) {
  write(
    LETTER_KEY,
    read<Letter>(LETTER_KEY).filter((r) => r.id !== id),
  );
}

export function getApplicants(): Applicant[] {
  return read<Applicant>(APPLICANT_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveApplicant(a: Applicant) {
  const rows = read<Applicant>(APPLICANT_KEY);
  const i = rows.findIndex((r) => r.id === a.id);
  if (i >= 0) rows[i] = a;
  else rows.push(a);
  write(APPLICANT_KEY, rows);
}

export function deleteApplicant(id: string) {
  write(
    APPLICANT_KEY,
    read<Applicant>(APPLICANT_KEY).filter((r) => r.id !== id),
  );
}

export function emptyLetter(type: LetterType = "offer"): Letter {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: uid(),
    letterId: "",
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "",
    email: "",
    phone: "",
    address: "",
    position: POSITIONS[0],
    employmentType: "Fresher",
    department: "",
    location: OFFICE_LOCATIONS[1],
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
    signatoryName: "Authorised Signatory",
    signatoryTitle: "CEO, EvolveNest Labs Pvt. Ltd.",
  };
}

export function formatDate(d: string) {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}
