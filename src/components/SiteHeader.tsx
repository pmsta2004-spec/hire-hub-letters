import { Link } from "@tanstack/react-router";
import { Bot, BrainCircuit, FileText, FolderOpen, IdCard, MessageSquareText, Settings, Users } from "lucide-react";

const nav = [
  { to: "/ats", label: "Candidates", icon: Users },
  { to: "/generate", label: "Letters", icon: FileText },
  { to: "/idcard", label: "ID Cards", icon: IdCard },
  { to: "/records", label: "Records", icon: FolderOpen },
  { to: "/feedback", label: "Feedback", icon: MessageSquareText },
  { to: "/chat", label: "AI Assistant", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-brand-deep/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground"><BrainCircuit className="h-5 w-5" /></span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-primary-foreground">
              AI-HRM
            </span>
            <span className="block text-[11px] text-brand">Intelligent hiring workspace</span>
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
              <n.icon className="mr-1.5 inline h-3.5 w-3.5" />{n.label}
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
        <p className="font-display text-sm font-semibold text-foreground">AI-HRM</p>
        <p>Artificial Intelligence Human Resource Manager</p>
      </div>
    </footer>
  );
}
