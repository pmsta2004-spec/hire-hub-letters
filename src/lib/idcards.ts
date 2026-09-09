export type IdCard = {
  id: string;
  employeeId: string;
  letterRef: string;
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
  photo: string;
  createdAt: string;
};

export function emptyIdCard(): IdCard {
  const today = new Date();
  const till = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
  return {
    id: "",
    employeeId: "",
    letterRef: "",
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
