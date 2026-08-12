import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, UserRound, FolderOpen, Download, IdCard, Building2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { COMPANY } from "@/lib/company";
import logo from "@/assets/evolvenest-logo.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EvolveNest Energy HR Suite — Offer & Joining Letters" },
      {
        name: "description",
        content:
          "Generate offer letters, joining letters and appointment letters for interns, freshers and experienced hires, with an applicant tracking system and PDF download.",
      },
      { property: "og:title", content: "EvolveNest Energy HR Suite" },
      {
        property: "og:description",
        content: "Applicant tracking plus instant offer, joining and appointment letters with PDF download.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: UserRound,
    title: "Applicant Tracking",
    text: "Log every applicant, move them through stages from Applied to Joined, and generate their letter in one click.",
    to: "/ats" as const,
  },
  {
    icon: FileText,
    title: "Letter Generator",
    text: "Offer letter, letter of joining and appointment letter with position, employment type and location selection.",
    to: "/generate" as const,
  },
  {
    icon: FolderOpen,
    title: "Saved Records",
    text: "Every letter is saved with a unique reference ID and can be reopened, edited or downloaded anytime.",
    to: "/records" as const,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="brand-gradient">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-xs text-brand">
              <Building2 className="h-3.5 w-3.5" /> {COMPANY.website}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
              Hire, track and issue letters — in minutes.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75 md:text-base">
              A simple HR desk for {COMPANY.name}: track applicants, then generate professional offer,
              joining and appointment letters for interns, freshers and experienced hires. Each letter
              gets a reference ID, is saved as a record and downloads as PDF.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/generate"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                <FileText className="h-4 w-4" /> Generate Letter
              </Link>
              <Link
                to="/ats"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                <UserRound className="h-4 w-4" /> Open ATS
              </Link>
            </div>
          </div>
          <div className="justify-self-center rounded-2xl border border-white/15 bg-black/40 p-8">
            <img src={logo.url} alt="EvolveNest Energy logo" className="w-56 rounded-xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <f.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-secondary p-6">
            <IdCard className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">Unique letter IDs</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Format ENE/OFR/2026/0001 — auto-generated per letter type and stored with the record.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-6">
            <Download className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">PDF download</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Print-ready A4 layout with company header, CEO signature and applicant acceptance block.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
