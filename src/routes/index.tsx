import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Users, FolderOpen, IdCard, BrainCircuit, MessageSquareText, ArrowRight, CalendarCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-HRM | AI Hiring and HR Operations" },
      {
        name: "description",
        content:
          "Rank resumes, schedule interviews, manage candidates, generate letters and create employee ID cards from one cloud workspace.",
      },
      { property: "og:title", content: "AI-HRM | AI Hiring and HR Operations" },
      {
        property: "og:description",
        content: "An intelligent HR workspace for hiring, interviews, letters and employee onboarding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Users,
    title: "AI candidate ranking",
    text: "Upload multiple resumes, compare job-fit scores and move the strongest candidates into interviews.",
    to: "/ats" as const,
  },
  {
    icon: FileText,
    title: "Letter Generator",
    text: "Create offer, joining and appointment letters from selected candidate records.",
    to: "/generate" as const,
  },
  {
    icon: FolderOpen,
    title: "Saved Records",
    text: "Cloud-saved letters, employee cards and invitation activity stay searchable and editable.",
    to: "/records" as const,
  },
  {
    icon: IdCard,
    title: "AI Employee ID Cards",
    text: "Turn a completed hire into a print-ready employee card with photo enhancement.",
    to: "/idcard" as const,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="brand-gradient overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1 text-xs text-brand">
              <BrainCircuit className="h-3.5 w-3.5" /> Artificial Intelligence Human Resource Manager
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
              AI-HRM
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75 md:text-base">
              Move from a folder of resumes to ranked candidates, scheduled interviews, offer letters and employee IDs without losing the hiring trail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/generate"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                <Users className="h-4 w-4" /> Open hiring pipeline <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ats"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <FileText className="h-4 w-4" /> Generate a letter
              </Link>
            </div>
            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-md border border-primary-foreground/20 bg-primary-foreground/20 md:grid-cols-4">
              {["Resume intake", "AI shortlist", "Interview tracking", "Onboarding docs"].map((step, index) => <div key={step} className="bg-brand-deep/95 p-4 text-xs text-primary-foreground"><span className="mb-2 block font-display text-lg text-brand">0{index + 1}</span>{step}</div>)}
            </div>
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
          <div className="border-l-2 border-brand bg-secondary p-6">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">One connected workflow</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Candidate status, interview details, invitation history and onboarding documents stay connected.
            </p>
          </div>
          <Link to="/feedback" className="border-l-2 border-primary bg-secondary p-6">
            <MessageSquareText className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">Feedback that improves operations</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Collect structured feedback and generate a thoughtful response with AI.
            </p>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
