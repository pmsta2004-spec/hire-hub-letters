export type Org = {
  name: string;
  tagline: string;
  website: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  gst: string;
  cin: string;
  signatoryName: string;
  signatoryTitle: string;
  hrEmail: string;
};

export const APP = {
  name: "AI-HRM",
  full: "Artificial Intelligence Human Resource Manager",
  short: "AI hiring, end to end",
};

export const DEFAULT_ORG: Org = {
  name: "AI-HRM",
  tagline: "Artificial Intelligence Human Resource Manager",
  website: "",
  email: "pm.sta958@gmail.com",
  phone: "",
  address1: "",
  address2: "",
  gst: "",
  cin: "",
  signatoryName: "Authorised Signatory",
  signatoryTitle: "Head of Human Resources",
  hrEmail: "pm.sta958@gmail.com",
};

export function locationOptions(org: Org) {
  return [org.address1, org.address2, "Remote"].filter((v) => v.trim().length > 0);
}
