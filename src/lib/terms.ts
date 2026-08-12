import type { EmploymentType } from "./letters";

export type TermsGroup = { heading: string; items: string[] };

type Category =
  | "Engineering & Technology"
  | "Solar & Field Engineering"
  | "Sales & Business Development"
  | "Marketing & Design"
  | "HR, Accounts & Operations"
  | "Customer Support"
  | "General";

const CATEGORY_MAP: { match: RegExp; category: Category }[] = [
  { match: /(software|frontend|backend|full stack|data|ai\/ml|engineer intern)/i, category: "Engineering & Technology" },
  { match: /(solar|electrical|project engineer|site supervisor)/i, category: "Solar & Field Engineering" },
  { match: /(business development|sales)/i, category: "Sales & Business Development" },
  { match: /(marketing|designer|graphic)/i, category: "Marketing & Design" },
  { match: /(hr|accounts|operations)/i, category: "HR, Accounts & Operations" },
  { match: /(support)/i, category: "Customer Support" },
];

export function categoryOf(position: string): Category {
  return CATEGORY_MAP.find((c) => c.match.test(position))?.category ?? "General";
}

const ROLE_TERMS: Record<Category, string[]> = {
  "Engineering & Technology": [
    "All source code, repositories, documentation, designs and technical assets created during your engagement are the sole intellectual property of the company.",
    "You shall follow the company's coding standards, version-control workflow and code-review process, and shall not deploy to production without approval.",
    "Use of third-party or open-source libraries must comply with their licences and requires prior approval for client-facing projects.",
    "Company-issued hardware, accounts, API keys and credentials must be kept secure and returned or revoked on the last working day.",
  ],
  "Solar & Field Engineering": [
    "You shall comply with all site safety norms, wear the prescribed PPE, and follow electrical safety and lockout procedures at all times.",
    "Site visits, surveys and travel shall be undertaken only with prior approval; approved travel and site expenses are reimbursed against valid bills.",
    "Design drawings, load calculations, BOQs and vendor data prepared for the company remain company property and shall not be shared externally.",
    "Any accident, near-miss, equipment damage or statutory non-compliance at site must be reported to the reporting manager the same day.",
  ],
  "Sales & Business Development": [
    "Client lists, pricing sheets, quotations, pipeline data and CRM records are confidential and shall not be copied or shared outside the company.",
    "Commitments on price, discount, delivery timelines or scope shall be made only within the limits approved in writing by the management.",
    "Incentives or commissions, if applicable, are payable as per the prevailing incentive policy and only on realised payments from clients.",
    "You shall not solicit company clients or leads for personal gain or for any competing business during or for twelve months after employment.",
  ],
  "Marketing & Design": [
    "All creatives, campaigns, copy, brand assets and design files produced during your engagement belong to the company.",
    "Brand guidelines must be followed; company logos, testimonials and client work may not be published on personal portfolios without written consent.",
    "Only licensed or company-approved fonts, stock media and software shall be used; the company will not indemnify unlicensed usage.",
    "Access to social media handles, ad accounts and analytics dashboards must be handed over completely on exit.",
  ],
  "HR, Accounts & Operations": [
    "You will handle employee records, payroll data, invoices and statutory filings with strict confidentiality and in line with applicable law.",
    "No financial transaction, vendor payment or offer of employment shall be processed without documented approval from the competent authority.",
    "Records must be maintained accurately and be available for internal or statutory audit at any time.",
    "Any conflict of interest, including related-party vendors, must be disclosed immediately in writing.",
  ],
  "Customer Support": [
    "Customer data, tickets and call recordings are confidential and shall be used strictly for service delivery.",
    "You shall adhere to the published shift roster, response and resolution timelines, and communication etiquette.",
    "Escalations shall be raised through the defined escalation matrix; no commitment on refunds or compensation shall be made independently.",
    "Professional conduct is expected on every customer interaction; recorded interactions may be reviewed for quality.",
  ],
  General: [
    "You shall perform the duties assigned to you diligently and may be assigned additional responsibilities suited to your skills.",
    "Company property, data and documents shall be used only for official purposes and returned on separation.",
    "You shall abide by all company policies, including code of conduct, anti-harassment and information-security policies.",
  ],
};

const TYPE_TERMS: Record<EmploymentType, string[]> = {
  Intern: [
    "The internship is for the stated duration and does not constitute an offer of permanent employment.",
    "A stipend, if applicable, is payable monthly subject to satisfactory attendance and performance.",
    "A certificate of completion will be issued only on completing the full duration and submitting the final project or report.",
    "Either party may end the internship with 7 days' written notice.",
  ],
  Fresher: [
    "Your appointment is subject to successful completion of the stated probation period.",
    "Training provided by the company is at company cost; you agree to remain available for the agreed minimum period after training.",
    "During probation, either party may terminate the engagement with 15 days' written notice.",
    "Confirmation of employment will be communicated in writing after review of your performance.",
  ],
  Experienced: [
    "Your appointment is subject to verification of previous employment, relieving letters and educational credentials.",
    "You confirm that you are not bound by any non-compete, bond or contractual obligation that conflicts with this role.",
    "After confirmation, either party may terminate employment with 30 days' written notice or salary in lieu thereof.",
    "You may be required to lead or mentor team members as part of your responsibilities.",
  ],
  Contract: [
    "This is a fixed-term contractual engagement for the stated duration and ends automatically on expiry unless renewed in writing.",
    "Statutory benefits applicable to permanent employees may not extend to this engagement.",
    "Either party may terminate the contract with 15 days' written notice.",
    "Payment is released against approved timesheets or deliverables as agreed.",
  ],
  "Full-time": [
    "This is a full-time position and you shall not take up any other employment or consulting assignment without written consent.",
    "Leave, holidays and benefits are governed by the prevailing company leave policy.",
    "After confirmation, either party may terminate employment with 30 days' written notice or salary in lieu thereof.",
    "Annual performance and compensation reviews are at the discretion of the management.",
  ],
  "Part-time": [
    "You shall be available for the agreed working hours or days per week, as communicated by your reporting manager.",
    "Compensation is pro-rated to the agreed hours and paid as per the stated pay cycle.",
    "Either party may terminate the engagement with 15 days' written notice.",
    "Any other engagement must not create a conflict of interest with the company's business.",
  ],
};

const COMMON_TERMS = [
  "Confidentiality: All business, technical, financial and client information accessed by you shall remain confidential during and after your association with the company.",
  "Intellectual property: Any work product, invention or improvement created in the course of your engagement vests solely with the company.",
  "Data protection: Company and client data shall not be stored on personal devices or cloud accounts without written approval.",
  "Discipline: Misconduct, misrepresentation, falsification of records or breach of these terms may lead to termination without notice.",
  "Amendments: Company policies may be revised from time to time and such revisions shall apply to your engagement.",
  "Jurisdiction: This letter and the terms herein are governed by the laws of India, with courts at Lucknow, Uttar Pradesh having exclusive jurisdiction.",
];

export function termsFor(position: string, employmentType: EmploymentType): TermsGroup[] {
  const category = categoryOf(position);
  return [
    { heading: `Role-specific terms — ${category}`, items: ROLE_TERMS[category] },
    { heading: `Engagement terms — ${employmentType}`, items: TYPE_TERMS[employmentType] },
    { heading: "General terms & conditions", items: COMMON_TERMS },
  ];
}
