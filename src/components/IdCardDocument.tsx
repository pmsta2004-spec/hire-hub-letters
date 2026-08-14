import { COMPANY } from "@/lib/company";
import { formatDate } from "@/lib/letters";
import type { IdCard } from "@/lib/idcards";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[9.5px] leading-snug">
      <span className="w-[52px] shrink-0 uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-medium text-ink">{value || "—"}</span>
    </div>
  );
}

export function IdCardDocument({ card }: { card: IdCard }) {
  return (
    <div className="print-sheet flex flex-wrap gap-6">
      {/* FRONT */}
      <div className="id-card relative flex h-[336px] w-[212px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
        <div className="brand-gradient px-3 pb-6 pt-3 text-center">
          <img
            src={COMPANY.logo}
            alt="EvolveNest Energy logo"
            className="mx-auto h-9 w-9 rounded-md bg-white object-cover p-0.5"
          />
          <p className="mt-1 font-display text-[10.5px] font-semibold uppercase tracking-wide text-primary-foreground">
            {COMPANY.name}
          </p>
          <p className="text-[7px] text-primary-foreground/80">{COMPANY.website}</p>
        </div>

        <div className="-mt-5 flex flex-col items-center px-3">
          <div className="h-[74px] w-[74px] overflow-hidden rounded-full border-[3px] border-white bg-muted shadow">
            {card.photo ? (
              <img src={card.photo} alt={card.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[8px] text-muted-foreground">
                Photo
              </div>
            )}
          </div>
          <p className="mt-2 text-center font-display text-[13px] font-bold leading-tight text-ink">
            {card.name || "Employee Name"}
          </p>
          <p className="text-center text-[9px] font-medium text-primary">
            {card.position || "Position"}
          </p>
          <p className="text-[7.5px] uppercase tracking-widest text-muted-foreground">
            {card.employmentType}
            {card.department ? ` • ${card.department}` : ""}
          </p>
        </div>

        <div className="mt-3 space-y-1 px-3">
          <Row label="ID" value={card.employeeId} />
          <Row label="Email" value={card.email} />
          <Row label="Mobile" value={card.phone} />
          <Row label="Valid" value={formatDate(card.validTill)} />
        </div>

        <div className="mt-auto border-t border-border px-3 py-2 text-center">
          <p className="text-[7px] leading-tight text-muted-foreground">
            Ref: {card.letterId || "—"} · Issued {formatDate(card.issueDate)}
          </p>
        </div>
      </div>

      {/* BACK */}
      <div className="id-card flex h-[336px] w-[212px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
        <div className="brand-gradient px-3 py-2 text-center">
          <p className="font-display text-[9px] font-semibold uppercase tracking-widest text-primary-foreground">
            Identity Card
          </p>
        </div>
        <div className="space-y-1 px-3 py-3">
          <Row label="Base" value={card.location} />
          <Row label="Blood" value={card.bloodGroup} />
          <Row label="SOS" value={card.emergencyContact} />
        </div>
        <div className="px-3 text-[7.5px] leading-relaxed text-muted-foreground">
          <p className="mb-1">
            This card is the property of {COMPANY.name} and must be surrendered on separation. It is
            non-transferable and valid only with a matching employment record.
          </p>
          <p>If found, please return to the address below or contact {COMPANY.phone}.</p>
        </div>
        <div className="mt-auto border-t border-border px-3 py-2">
          <p className="mb-3 text-right text-[7.5px] text-muted-foreground">
            <span className="block h-5" />
            <span className="border-t border-ink/40 pt-0.5">Authorised Signatory</span>
          </p>
          <p className="text-[6.5px] leading-tight text-muted-foreground">
            {COMPANY.offices[1]}
            <br />
            {COMPANY.email} · GST {COMPANY.gst}
          </p>
        </div>
      </div>
    </div>
  );
}
