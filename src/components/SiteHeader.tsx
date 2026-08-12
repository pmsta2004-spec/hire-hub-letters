import { Link } from "@tanstack/react-router";
import logo from "@/assets/evolvenest-logo.jpeg.asset.json";
import { COMPANY } from "@/lib/company";

const nav = [
  { to: "/", label: "Home" },
  { to: "/ats", label: "ATS" },
  { to: "/generate", label: "Generate Letter" },
  { to: "/records", label: "Records" },
];

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-brand-deep/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="EvolveNest Energy logo"
            className="h-10 w-10 rounded-md object-cover"
          />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-primary-foreground">
              {COMPANY.name}
            </span>
            <span className="block text-[11px] text-brand">HR Document Suite</span>
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-primary-foreground"
              activeProps={{ className: "bg-white/15 text-primary-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground">
        <p className="font-display text-sm font-semibold text-foreground">{COMPANY.name}</p>
        <p>{COMPANY.managedBy}</p>
        {COMPANY.offices.map((o) => (
          <p key={o}>{o}</p>
        ))}
        <p>
          {COMPANY.email} | {COMPANY.phone} | {COMPANY.website}
        </p>
        <p>
          GST: {COMPANY.gst} &nbsp;|&nbsp; CIN: {COMPANY.cin}
        </p>
      </div>
    </footer>
  );
}
