import { uid } from "@/lib/letters";

export type IdCard = {
  id: string;
  employeeId: string;
  letterId: string;
  name: string;
  position: string;
  department: string;
  employmentType: string;
  email: string;
  phone: string;
  location: string;
  bloodGroup: string;
  emergencyContact: string;
  issueDate: string;
  validTill: string;
  photo: string; // data URL
  createdAt: string;
};

const KEY = "ene_idcards_v1";

function read(): IdCard[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as IdCard[];
  } catch {
    return [];
  }
}

export function getIdCards(): IdCard[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveIdCard(card: IdCard) {
  const rows = read();
  const i = rows.findIndex((r) => r.id === card.id);
  if (i >= 0) rows[i] = card;
  else rows.push(card);
  window.localStorage.setItem(KEY, JSON.stringify(rows));
}

export function deleteIdCard(id: string) {
  window.localStorage.setItem(KEY, JSON.stringify(read().filter((r) => r.id !== id)));
}

export function nextEmployeeId() {
  const year = new Date().getFullYear();
  const count = read().length + 1;
  return `ENE/EMP/${year}/${String(count).padStart(4, "0")}`;
}

export function emptyIdCard(): IdCard {
  const today = new Date();
  const till = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
  return {
    id: uid(),
    employeeId: "",
    letterId: "",
    name: "",
    position: "",
    department: "",
    employmentType: "Fresher",
    email: "",
    phone: "",
    location: "",
    bloodGroup: "",
    emergencyContact: "",
    issueDate: today.toISOString().slice(0, 10),
    validTill: till.toISOString().slice(0, 10),
    photo: "",
    createdAt: today.toISOString(),
  };
}
