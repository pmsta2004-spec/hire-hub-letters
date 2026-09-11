import { formatDate, type Letter } from "@/lib/letters";
import { termsFor } from "@/lib/terms";
import { DEFAULT_ORG, type Org } from "@/lib/org";

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[13.5px] leading-relaxed text-ink">{children}</p>;
}

function titleOf(l: Letter) {
  if (l.type === "offer") return "OFFER LETTER";
  if (l.type === "joining") return "LETTER OF JOINING";
  return "APPOINTMENT LETTER";
}

function Body({ l, org }: { l: Letter; org: Org }) {
  const pay = l.employmentType === "Intern" ? l.stipend || l.ctc : l.ctc;
  const payWord = l.employmentType === "Intern" ? "stipend" : "compensation";

  if (l.type === "offer") {
    return (
      <>
        <Para>Dear {l.name || "Candidate"},</Para>
        <Para>
          We are pleased to offer you the position of <strong>{l.position}</strong> (
          {l.employmentType}) at {org.name}
          {l.department ? `, ${l.department} department` : ""}. Your engagement is expected to
          commence on <strong>{formatDate(l.startDate)}</strong>, based at {l.location}.
        </Para>
        <Para>
          Your {payWord} for this role will be <strong>{pay || "as discussed"}</strong>, payable on
          a {l.payCycle.toLowerCase()} basis
          {l.duration ? `, for a duration of ${l.duration}` : ""}. You will report to{" "}
          {l.reportingTo || "the reporting manager assigned to you"}. Standard working hours are{" "}
          {l.workHours}.
          {l.probation ? ` This offer includes a probation period of ${l.probation}.` : ""}
        </Para>
        <Para>
          This offer is contingent upon verification of your documents, previous employment and
          educational records. By accepting, you agree to maintain confidentiality of all company
          information and to abide by the policies of {org.name}.
        </Para>
        {l.notes ? <Para>{l.notes}</Para> : null}
        <Para>
          Please sign and return a copy of this letter as a token of your acceptance. We look forward
          to welcoming you to the team.
        </Para>
      </>
    );
  }

  if (l.type === "joining") {
    return (
      <>
        <Para>Dear {l.name || "Candidate"},</Para>
        <Para>
          This letter confirms that you have joined {org.name} as{" "}
          <strong>{l.position}</strong> ({l.employmentType}) with effect from{" "}
          <strong>{formatDate(l.startDate)}</strong>
          {l.department ? `, in the ${l.department} department` : ""}. Your place of posting is{" "}
          {l.location}.
        </Para>
        <Para>
          Your agreed {payWord} is <strong>{pay || "as per your offer letter"}</strong> ({l.payCycle}
          ). You will report to {l.reportingTo || "your assigned reporting manager"} and your working
          hours are {l.workHours}.
          {l.probation ? ` Your probation period is ${l.probation} from the date of joining.` : ""}
        </Para>
        <Para>
          You are requested to submit all pending documents to the HR department, if any. This letter
          serves as an official record of your joining with {org.name}.
        </Para>
        {l.notes ? <Para>{l.notes}</Para> : null}
      </>
    );
  }

  return (
    <>
      <Para>Dear {l.name || "Candidate"},</Para>
      <Para>
        With reference to your application and subsequent interviews, we are pleased to appoint you
        as <strong>{l.position}</strong> ({l.employmentType}) at {org.name}
        {l.department ? `, ${l.department} department` : ""}, effective{" "}
        <strong>{formatDate(l.startDate)}</strong>. Your place of posting will be {l.location}.
      </Para>
      <Para>
        1. Remuneration: Your {payWord} will be <strong>{pay || "as discussed"}</strong>, payable{" "}
        {l.payCycle.toLowerCase()}, subject to applicable statutory deductions.
      </Para>
      <Para>
        2. Reporting &amp; hours: You will report to{" "}
        {l.reportingTo || "the reporting manager assigned to you"}. Working hours are {l.workHours}.
      </Para>
      <Para>
        3. Probation: {l.probation || "Not applicable"}. On satisfactory completion, your appointment
        will be confirmed in writing.
      </Para>
      <Para>
        4. Confidentiality: You shall not disclose any confidential or proprietary information of the
        company during or after your employment.
      </Para>
      <Para>
        5. Notice period &amp; conduct: Your employment shall be governed by the policies of{" "}
        {org.name} as amended from time to time.
      </Para>
      {l.notes ? <Para>{l.notes}</Para> : null}
      <Para>Please sign below to confirm your acceptance of this appointment.</Para>
    </>
  );
}


function BrandMark() {
  return <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-deep font-display text-sm font-bold text-primary-foreground">AI</div>;
}

function TermsAnnexure({ letter, org }: { letter: Letter; org: Org }) {
  const groups = termsFor(letter.position, letter.employmentType);
  return (
    <div
      className="print-sheet print-break mx-auto mt-8 w-full max-w-[820px] rounded-xl border border-border bg-card p-8 shadow-lg sm:p-12"
      style={{ fontFamily: "var(--font-letter)" }}
    >
      <div className="flex items-center gap-3 border-b-2 border-brand pb-4">
        <BrandMark />
        <div>
          <h2 className="font-display text-lg font-bold leading-tight text-ink">{org.name}</h2>
          <p className="text-[11px] text-muted-foreground">{org.tagline}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-[12px] text-muted-foreground">
        <span>
          Ref No: <strong className="text-ink">{letter.letterId || "—"}</strong>
        </span>
        <span>Date: {formatDate(letter.letterDate)}</span>
      </div>

      <h1 className="my-5 text-center font-display text-base font-bold tracking-[0.16em] text-ink">
        ANNEXURE — TERMS &amp; CONDITIONS
      </h1>

      <p className="mb-5 text-[12.5px] leading-relaxed text-ink">
        These terms form an integral part of the {titleOf(letter).toLowerCase()} issued to{" "}
        <strong>{letter.name || "Candidate Name"}</strong> for the position of{" "}
        <strong>{letter.position}</strong> ({letter.employmentType}).
      </p>

      {groups.map((g) => (
        <div key={g.heading} className="mb-5">
          <h3 className="mb-2 font-display text-[12.5px] font-semibold uppercase tracking-wide text-brand-deep">
            {g.heading}
          </h3>
          <ol className="list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-ink">
            {g.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      ))}

      <div className="mt-10 flex flex-wrap justify-between gap-10 text-[12.5px] text-ink">
        <div className="min-w-[220px]">
          <p className="h-12 border-b border-ink/40" />
          <p className="mt-2 font-semibold">{letter.signatoryName || org.signatoryName}</p>
          <p className="text-muted-foreground">{letter.signatoryTitle}</p>
        </div>
        <div className="min-w-[220px]">
          <p className="h-12 border-b border-ink/40" />
          <p className="mt-2 font-semibold">
            Read &amp; accepted: {letter.name || "Candidate Name"}
          </p>
          <p className="text-muted-foreground">Date: ____________________</p>
        </div>
      </div>
    </div>
  );
}

export function LetterDocument({
  letter,
  showTerms = true,
  org = DEFAULT_ORG,
}: {
  letter: Letter;
  showTerms?: boolean;
  org?: Org;
}) {
  return (
    <>
    <div
      className="print-sheet mx-auto w-full max-w-[820px] rounded-xl border border-border bg-card p-8 shadow-lg sm:p-12"
      style={{ fontFamily: "var(--font-letter)" }}
    >
      <div className="flex items-start gap-4 border-b-2 border-brand pb-5">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">{org.name}</h2>
          <p className="text-[11px] text-muted-foreground">{org.tagline}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {[org.address1, org.address2].filter(Boolean).join(" · ") || "Company address not configured"}<br />
            {[org.email, org.phone, org.website].filter(Boolean).join(" · ")}<br />
            {[org.gst && `GST: ${org.gst}`, org.cin && `CIN: ${org.cin}`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 text-[12px] text-muted-foreground">
        <span>
          Ref No: <strong className="text-ink">{letter.letterId || "—"}</strong>
        </span>
        <span>Date: {formatDate(letter.letterDate)}</span>
      </div>

      <h1 className="my-6 text-center font-display text-lg font-bold tracking-[0.18em] text-ink">
        {titleOf(letter)}
      </h1>

      <div className="mb-6 text-[12.5px] leading-relaxed text-ink">
        <p className="font-semibold">{letter.name || "Candidate Name"}</p>
        {letter.address ? <p className="whitespace-pre-line">{letter.address}</p> : null}
        {letter.phone ? <p>{letter.phone}</p> : null}
        {letter.email ? <p>{letter.email}</p> : null}
      </div>

      <Body l={letter} org={org} />

      <div className="mt-12 flex flex-wrap justify-between gap-10 text-[12.5px] text-ink">
        <div className="min-w-[220px]">
          <p className="h-12 border-b border-ink/40" />
          <p className="mt-2 font-semibold">{letter.signatoryName || org.signatoryName}</p>
          <p className="text-muted-foreground">{letter.signatoryTitle}</p>
          <p className="text-muted-foreground">{org.name}</p>
        </div>
        <div className="min-w-[220px]">
          <p className="h-12 border-b border-ink/40" />
          <p className="mt-2 font-semibold">Accepted by: {letter.name || "Candidate Name"}</p>
          <p className="text-muted-foreground">Position: {letter.position}</p>
          <p className="text-muted-foreground">Date: ____________________</p>
        </div>
      </div>
    </div>
      {showTerms ? <TermsAnnexure letter={letter} org={org} /> : null}
    </>
  );
}

